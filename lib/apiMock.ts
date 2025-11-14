
import { mockDB } from './mockDB';
import { auth } from './authMock';
import { delay } from './utils';

type TableKey = keyof typeof mockDB;

type DatabaseState = { [K in TableKey]: typeof mockDB[K] };

const STORAGE_KEY = 'supabase.mock.db';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const hasWindow = () => typeof window !== 'undefined';

const readPersistedState = (): DatabaseState | null => {
  if (!hasWindow()) return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed as DatabaseState;
  } catch (error) {
    console.warn('Failed to parse stored mock database. Resetting to defaults.', error);
    return null;
  }
};

let databaseCache: DatabaseState | null = null;

const getDatabase = (): DatabaseState => {
  if (!databaseCache) {
    const base = clone(mockDB) as DatabaseState;
    const persisted = readPersistedState();

    if (persisted) {
      const merged = { ...base } as DatabaseState;
      (Object.keys(base) as TableKey[]).forEach((key) => {
        merged[key] = Array.isArray(persisted[key]) ? clone(persisted[key]) : clone(base[key]);
      });
      databaseCache = merged;
    } else {
      databaseCache = base;
    }

    if (hasWindow()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(databaseCache));
    }
  }

  return databaseCache;
};

const persistDatabase = () => {
  if (hasWindow() && databaseCache) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(databaseCache));
  }
};

// This makes the builder await-able.
type QueryBuilder = {
  select(columns?: string): QueryBuilder;
  insert(payload: any): QueryBuilder;
  update(payload: any): QueryBuilder;
  delete(): QueryBuilder;
  eq(column: string, value: any): QueryBuilder;
  single(): QueryBuilder;
  limit(count: number): QueryBuilder;
  then(
    onfulfilled: (value: { data: any; error: any }) => any,
    onrejected?: (reason: any) => any
  ): Promise<any>;
};

const from = (table: TableKey) => {
  let _filters: Array<(data: any[]) => any[]> = [];
  let _eqFilters: Array<{ column: string; value: any }> = [];
  let _limit: number | null = null;
  let _single = false;
  let _columns = '*';
  let _operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  let _payload: any = null;

  const matchesFilters = (item: any) =>
    _eqFilters.every(({ column, value }) => item[column] === value);

  const applyFilters = (data: any[]) => {
    let result = data;
    for (const filter of _filters) {
      result = filter(result);
    }
    return result;
  };

  const execute = async () => {
    await delay(150);

    const db = getDatabase();
    const tableData = db[table] as any[];

    if (_operation === 'insert') {
      const rows = Array.isArray(_payload) ? _payload : [_payload];
      const inserted = clone(rows);
      tableData.push(...inserted.map((row) => ({ ...row })));
      persistDatabase();
      return { data: inserted, error: null };
    }

    if (_operation === 'update') {
      const updatedRows: any[] = [];
      tableData.forEach((item, index) => {
        if (matchesFilters(item)) {
          const updated = { ...item, ..._payload };
          tableData[index] = updated;
          updatedRows.push(clone(updated));
        }
      });
      persistDatabase();
      return { data: updatedRows, error: null };
    }

    if (_operation === 'delete') {
      const remaining: any[] = [];
      const deleted: any[] = [];

      for (const item of tableData) {
        if (matchesFilters(item)) {
          deleted.push(clone(item));
        } else {
          remaining.push(item);
        }
      }

      db[table] = remaining as any;
      persistDatabase();
      return { data: deleted, error: null };
    }

    let results: any[] = clone(tableData);

    // Apply filters
    results = applyFilters(results);

    // Simula RLS
    if (hasWindow()) {
      const sessionStr = window.localStorage.getItem('supabase.session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const { profile } = session;

        if (profile.role === 'personal') {
          if (results.length > 0 && 'personal_id' in results[0]) {
            results = results.filter((item: any) => item.personal_id === profile.id);
          }
        } else if (profile.role === 'aluno') {
          if (results.length > 0 && 'aluno_id' in results[0]) {
            results = results.filter((item: any) => item.aluno_id === profile.id);
          }
        }
      }
    }

    // Simula joins usando o estado atual
    if (_columns.includes('profiles(*)')) {
      results = results.map((item: any) => ({
        ...item,
        profiles: (db.profiles as any[]).find((p) => p.id === item.profile_id),
      }));
    }
    if (_columns.includes('treinos_exercicios(*, exercicios(*))')) {
      results = results.map((treino: any) => ({
        ...treino,
        treinos_exercicios: (db.treinos_exercicios as any[])
          .filter((te) => te.treino_id === treino.id)
          .map((te) => ({
            ...te,
            exercicios: (db.exercicios as any[]).find((e) => e.id === te.exercicio_id),
          })),
      }));
    }

    if (_limit) {
      results = results.slice(0, _limit);
    }

    if (_single) {
      const data = results[0] || null;
      const error = results.length > 1 ? { message: 'Multiple rows returned' } : null;
      return { data, error };
    }

    return { data: results, error: null };
  };

  const queryBuilder: QueryBuilder = {
    select(columns = '*') {
      if (_operation !== 'select') {
        // Treat select after mutations as a no-op for compatibility.
        return this;
      }

      _columns = columns;
      return this;
    },

    insert(payload: any) {
      _operation = 'insert';
      _payload = payload;
      return this;
    },

    update(payload: any) {
      _operation = 'update';
      _payload = payload;
      return this;
    },

    delete() {
      _operation = 'delete';
      return this;
    },

    eq(column: string, value: any) {
      _filters.push((data) => data.filter((item) => item[column] === value));
      _eqFilters.push({ column, value });
      return this;
    },

    single() {
      _single = true;
      return this;
    },

    limit(count: number) {
      _limit = count;
      return this;
    },

    then(onfulfilled, onrejected) {
      return execute().then(onfulfilled, onrejected);
    },
  };

  return queryBuilder;
};

// Para usar o Supabase real, substitua esta exportação pelo cliente oficial em
// `lib/supabaseClient.ts`, comentando a linha abaixo e habilitando o
// `createClient` da biblioteca `@supabase/supabase-js`.
export const supabase = {
  auth,
  from,
};
