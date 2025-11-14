import type { Session } from '@/types';

import { auth } from './mockAuth';
import { mockDB, type MockDatabase } from './mockDB';
import { clone, delay, readJSON, writeJSON } from './mockUtils';

const STORAGE_KEY = 'supabase.mock.db';
const SESSION_KEY = 'supabase.session';

let databaseCache: MockDatabase | null = null;

type TableName = keyof MockDatabase;
type TableRow<T extends TableName> = MockDatabase[T] extends Array<infer Row> ? Row : never;

type QueryError = { message: string };

type QueryResult<T> = Promise<{ data: T | null; error: QueryError | null }>;

interface QueryBuilder<T> extends PromiseLike<{ data: T[] | T | null; error: QueryError | null }> {
  select(columns?: string): QueryBuilder<T>;
  insert(payload: T | T[]): QueryBuilder<T>;
  update(payload: Partial<T>): QueryBuilder<T>;
  delete(): QueryBuilder<T>;
  eq<K extends keyof T>(column: K, value: T[K]): QueryBuilder<T>;
  in<K extends keyof T>(column: K, values: Array<T[K]>): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  single(): QueryBuilder<T>;
}

/**
 * Loads the mock database into memory, hydrating persisted overrides from storage when available.
 *
 * @returns A mutable in-memory representation of the mock Supabase database.
 */
const loadDatabase = (): MockDatabase => {
  if (!databaseCache) {
    const base = clone(mockDB);
    const persisted = readJSON<Partial<MockDatabase>>(STORAGE_KEY);

    if (persisted) {
      for (const key of Object.keys(base) as TableName[]) {
        const persistedValue = persisted[key];
        if (Array.isArray(persistedValue)) {
          // @ts-expect-error - structural assignment is safe for mock data
          base[key] = persistedValue;
        }
      }
    }

    databaseCache = base;
    writeJSON(STORAGE_KEY, databaseCache);
  }

  return databaseCache;
};

/**
 * Persists the current in-memory mock database snapshot into storage.
 *
 * @returns Nothing.
 */
const persistDatabase = () => {
  if (databaseCache) {
    writeJSON(STORAGE_KEY, databaseCache);
  }
};

/**
 * Applies role-based access policies to the provided rows to mimic Supabase RLS behaviour.
 *
 * @typeParam T - Name of the table whose rows are being filtered.
 * @param table - Table identifier for which policies should be applied.
 * @param rows - Resulting rows prior to policy evaluation.
 * @param db - Reference to the mock database to resolve relationships.
 * @returns The subset of rows permitted for the current session.
 */
const applyPolicies = <T extends TableName>(table: T, rows: TableRow<T>[], db: MockDatabase): TableRow<T>[] => {
  const session = readJSON<Session>(SESSION_KEY);
  if (!session?.profile) {
    return rows;
  }

  const { profile } = session;

  if (profile.role === 'personal') {
    if (table === 'alunos') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.personal_id === profile.id;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (table === 'profiles') {
      const relatedIds = db.alunos.filter((aluno) => aluno.personal_id === profile.id).map((aluno) => aluno.profile_id);
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.id === profile.id || relatedIds.includes(record.id as string);
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (table === 'treinos') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.personal_id === profile.id;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (table === 'treinos_exercicios') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          const treinoId = record.treino_id as string | undefined;
          const treino = db.treinos.find((item) => item.id === treinoId);
          return treino ? treino.personal_id === profile.id : false;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (['progresso', 'feedback', 'videos_correcao', 'medidas'].includes(table)) {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          const alunoId = record.aluno_id as string | undefined;
          const aluno = db.alunos.find((item) => item.id === alunoId);
          return aluno ? aluno.personal_id === profile.id : false;
        })
        .map((row) => row) as TableRow<T>[];
    }

    return rows;
  }

  if (profile.role === 'aluno') {
    const aluno = db.alunos.find((item) => item.profile_id === profile.id);
    const alunoId = aluno?.id ?? null;

    if (table === 'profiles') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.id === profile.id;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (table === 'alunos') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.id === alunoId;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (table === 'treinos') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.aluno_id === alunoId;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (table === 'treinos_exercicios') {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          const treinoId = record.treino_id as string | undefined;
          const treino = db.treinos.find((item) => item.id === treinoId);
          return treino ? treino.aluno_id === alunoId : false;
        })
        .map((row) => row) as TableRow<T>[];
    }

    if (['progresso', 'feedback', 'videos_correcao', 'medidas'].includes(table)) {
      return rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return record.aluno_id === alunoId;
        })
        .map((row) => row) as TableRow<T>[];
    }

    return rows
      .filter((row) => {
        const record = row as Record<string, unknown>;
        const userId = (record.user_id ?? record.id) as string | undefined;
        return userId === profile.user_id;
      })
      .map((row) => row) as TableRow<T>[];
  }

  return rows;
};

/**
 * Resolves requested relational columns in the mock query by embedding the related rows.
 *
 * @typeParam T - Name of the table being queried.
 * @param table - Table identifier of the query.
 * @param rows - Rows produced by the base table query.
 * @param columns - Column selection string describing requested relations.
 * @param db - Reference to the mock database for lookups.
 * @returns Rows enriched with the requested relational data.
 */
const hydrateColumns = <T extends TableName>(table: T, rows: TableRow<T>[], columns: string, db: MockDatabase): TableRow<T>[] => {
  if (!Array.isArray(rows)) {
    return rows;
  }

  if (table === 'alunos' && columns.includes('profiles(*)')) {
    return rows
      .map((aluno) => {
        const record = aluno as Record<string, unknown>;
        return {
          ...record,
          profiles: db.profiles.find((profile) => profile.id === record.profile_id) ?? null,
        };
      })
      .map((row) => row as TableRow<T>);
  }

  if (table === 'treinos' && columns.includes('treinos_exercicios(*, exercicios(*))')) {
    return rows
      .map((treino) => {
        const record = treino as Record<string, unknown>;
        return {
          ...record,
          treinos_exercicios: db.treinos_exercicios
            .filter((item) => item.treino_id === record.id)
            .sort((a, b) => a.order - b.order)
            .map((item) => ({
              ...item,
              exercicios: db.exercicios.find((exercicio) => exercicio.id === item.exercicio_id) ?? null,
            })),
        };
      })
      .map((row) => row as TableRow<T>);
  }

  if (table === 'videos_correcao' && columns.includes('treinos_exercicios(*)')) {
    return rows
      .map((video) => {
        const record = video as Record<string, unknown>;
        return {
          ...record,
          treinos_exercicios: db.treinos_exercicios.find((item) => item.id === record.treino_exercicio_id) ?? null,
        };
      })
      .map((row) => row as TableRow<T>);
  }

  return rows;
};

/**
 * Creates a chainable query builder that mimics the Supabase client for the provided table.
 *
 * @typeParam T - Name of the mock table to operate on.
 * @param table - Table identifier to query.
 * @returns A Supabase-like query builder supporting select, insert, update and delete operations.
 */
const from = <T extends TableName>(table: T) => {
  const db = loadDatabase();

  let filters: Array<(data: TableRow<T>[]) => TableRow<T>[]> = [];
  let eqFilters: Array<{ column: keyof TableRow<T>; value: TableRow<T>[keyof TableRow<T>] }> = [];
  let limit: number | null = null;
  let single = false;
  let columns = '*';
  let operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  let payload: TableRow<T> | TableRow<T>[] | Partial<TableRow<T>> | null = null;

  /**
   * Determines whether the given row satisfies the accumulated equality filters.
   *
   * @param item - Row under evaluation.
   * @returns `true` when the row passes every equality filter; otherwise `false`.
   */
  const matchesFilters = (item: TableRow<T>): boolean =>
    eqFilters.every(({ column, value }) => item[column] === value);

  /**
   * Applies the registered filter pipeline to the provided dataset.
   *
   * @param data - Rows to filter.
   * @returns Filtered rows after all predicates run.
   */
  const applyFiltersPipeline = (data: TableRow<T>[]): TableRow<T>[] => {
    return filters.reduce((acc, filter) => filter(acc), data);
  };

  /**
   * Executes the queued database operation against the mock store.
   *
   * @returns A promise resolving with the query result payload or error details.
   */
  const execute = async (): QueryResult<TableRow<T>[] | TableRow<T>> => {
    await delay(160);

    const database = loadDatabase();
    const tableData = database[table];

    if (!Array.isArray(tableData)) {
      return { data: null, error: { message: `Tabela ${String(table)} não encontrada.` } };
    }

    if (operation === 'insert') {
      if (!payload) {
        return { data: null, error: { message: 'No payload provided for insert.' } };
      }

      const rows = Array.isArray(payload) ? payload : [payload];
      const inserted = rows.map((row) => clone(row as TableRow<T>));
      (tableData as TableRow<T>[]).push(...inserted);
      persistDatabase();
      return { data: inserted, error: null };
    }

    if (operation === 'update') {
      const updatedRows: TableRow<T>[] = [];
      (database[table] as TableRow<T>[]) = (tableData as TableRow<T>[]).map((item) => {
        if (matchesFilters(item)) {
          const updated = {
            ...(item as Record<string, unknown>),
            ...(payload as Record<string, unknown>),
          } as TableRow<T>;
          updatedRows.push(clone(updated));
          return updated;
        }
        return item;
      });
      persistDatabase();
      return { data: updatedRows, error: null };
    }

    if (operation === 'delete') {
      const remaining: TableRow<T>[] = [];
      const deleted: TableRow<T>[] = [];
      for (const item of tableData as TableRow<T>[]) {
        if (matchesFilters(item)) {
          deleted.push(clone(item));
        } else {
          remaining.push(item);
        }
      }
      (database[table] as TableRow<T>[]) = remaining;
      persistDatabase();
      return { data: deleted, error: null };
    }

    let results = clone(tableData) as TableRow<T>[];
    results = applyFiltersPipeline(results);
    results = applyPolicies(table, results, database);
    results = hydrateColumns(table, results, columns, database);

    if (limit != null) {
      results = results.slice(0, limit);
    }

    if (single) {
      const data = results[0] ?? null;
      const error = results.length > 1 ? ({ message: 'Multiple rows returned' } as QueryError) : null;
      return { data, error } as { data: TableRow<T> | null; error: QueryError | null };
    }

    return { data: results, error: null };
  };

  const builder: QueryBuilder<TableRow<T>> = {
    /**
     * Specifies the column selection string for the query, supporting relation hydration.
     *
     * @param selectColumns - Column selection string using Supabase syntax.
     * @returns The query builder for continued chaining.
     */
    select(selectColumns = '*') {
      if (operation === 'select') {
        columns = selectColumns;
      }
      return builder;
    },
    /**
     * Queues an insert operation with the provided payload.
     *
     * @param insertPayload - Single row or array of rows to insert.
     * @returns The query builder for chaining or awaiting.
     */
    insert(insertPayload: TableRow<T> | TableRow<T>[]) {
      operation = 'insert';
      payload = insertPayload;
      return builder;
    },
    /**
     * Queues an update operation for rows matching the configured filters.
     *
     * @param updatePayload - Partial row containing the columns to update.
     * @returns The query builder for chaining or awaiting.
     */
    update(updatePayload: Partial<TableRow<T>>) {
      operation = 'update';
      payload = updatePayload;
      return builder;
    },
    /**
     * Queues a delete operation for rows matching the configured filters.
     *
     * @returns The query builder for chaining or awaiting.
     */
    delete() {
      operation = 'delete';
      return builder;
    },
    /**
     * Adds an equality filter to the query for the specified column/value pair.
     *
     * @typeParam K - Column name constrained to the table's keys.
     * @param column - Column name to filter by.
     * @param value - Value the column must match.
     * @returns The query builder for chaining additional clauses.
     */
    eq<K extends keyof TableRow<T>>(column: K, value: TableRow<T>[K]) {
      filters.push((data) => data.filter((item) => item[column] === value));
      eqFilters.push({ column, value });
      return builder;
    },
    /**
     * Adds an inclusion filter ensuring the column matches one of the provided values.
     *
     * @typeParam K - Column name constrained to the table's keys.
     * @param column - Column name to filter by.
     * @param values - Accepted values for the column.
     * @returns The query builder for chaining additional clauses.
     */
    in<K extends keyof TableRow<T>>(column: K, values: Array<TableRow<T>[K]>) {
      filters.push((data) => data.filter((item) => values.includes(item[column])));
      return builder;
    },
    /**
     * Limits the number of rows returned by the query.
     *
     * @param count - Maximum number of rows to return.
     * @returns The query builder for chaining additional clauses.
     */
    limit(count: number) {
      limit = count;
      return builder;
    },
    /**
     * Indicates that only a single row should be returned, mirroring Supabase's `.single()`.
     *
     * @returns The query builder for chaining additional clauses.
     */
    single() {
      single = true;
      return builder;
    },
    /**
     * Enables awaiting the builder directly, executing the queued operation.
     *
     * @param onfulfilled - Handler invoked when the query resolves successfully.
     * @param onrejected - Handler invoked when the query rejects.
     * @returns A promise representing the executed query.
     */
    then(onfulfilled, onrejected) {
      return execute().then(onfulfilled, onrejected);
    },
  };

  return builder;
};

/**
 * Public mock Supabase client exposing authentication and database helpers used throughout the app.
 */
export const supabase = {
  auth,
  from,
};
