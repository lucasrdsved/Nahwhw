// @ts-check
import { mockDB } from './mockDB';
import { auth } from './mockAuth';
import { clone, delay, readJSON, writeJSON } from './mockUtils';

const STORAGE_KEY = 'supabase.mock.db';
const SESSION_KEY = 'supabase.session';

let databaseCache = null;

const loadDatabase = () => {
  if (!databaseCache) {
    const base = clone(mockDB);
    const persisted = readJSON(STORAGE_KEY);

    if (persisted) {
      for (const key of Object.keys(base)) {
        if (Array.isArray(persisted[key])) {
          base[key] = persisted[key];
        }
      }
    }

    databaseCache = base;
    writeJSON(STORAGE_KEY, databaseCache);
  }

  return databaseCache;
};

const persistDatabase = () => {
  if (databaseCache) {
    writeJSON(STORAGE_KEY, databaseCache);
  }
};

const applyPolicies = (table, rows, db) => {
  const session = readJSON(SESSION_KEY);
  if (!session) return rows;

  const { profile } = session;
  if (!profile) return rows;

  if (profile.role === 'personal') {
    if (table === 'alunos') {
      return rows.filter((row) => row.personal_id === profile.id);
    }

    if (table === 'profiles') {
      const relatedIds = db.alunos
        .filter((aluno) => aluno.personal_id === profile.id)
        .map((aluno) => aluno.profile_id);
      return rows.filter((row) => row.id === profile.id || relatedIds.includes(row.id));
    }

    if (table === 'treinos') {
      return rows.filter((row) => row.personal_id === profile.id);
    }

    if (table === 'treinos_exercicios') {
      return rows.filter((row) => {
        const treino = db.treinos.find((item) => item.id === row.treino_id);
        return treino ? treino.personal_id === profile.id : false;
      });
    }

    if (['progresso', 'feedback', 'videos_correcao', 'medidas'].includes(table)) {
      return rows.filter((row) => {
        const aluno = db.alunos.find((item) => item.id === row.aluno_id);
        return aluno ? aluno.personal_id === profile.id : false;
      });
    }

    return rows;
  }

  if (profile.role === 'aluno') {
    const aluno = db.alunos.find((item) => item.profile_id === profile.id);
    const alunoId = aluno ? aluno.id : null;

    if (table === 'profiles') {
      return rows.filter((row) => row.id === profile.id);
    }

    if (table === 'alunos') {
      return rows.filter((row) => row.id === alunoId);
    }

    if (table === 'treinos') {
      return rows.filter((row) => row.aluno_id === alunoId);
    }

    if (table === 'treinos_exercicios') {
      return rows.filter((row) => {
        const treino = db.treinos.find((item) => item.id === row.treino_id);
        return treino ? treino.aluno_id === alunoId : false;
      });
    }

    if (['progresso', 'feedback', 'videos_correcao', 'medidas'].includes(table)) {
      return rows.filter((row) => row.aluno_id === alunoId);
    }

    return rows.filter((row) => row.user_id === profile.user_id || row.id === profile.id);
  }

  return rows;
};

const hydrateColumns = (table, rows, columns, db) => {
  if (!Array.isArray(rows)) return rows;

  if (table === 'alunos' && columns.includes('profiles(*)')) {
    return rows.map((aluno) => ({
      ...aluno,
      profiles: db.profiles.find((profile) => profile.id === aluno.profile_id) ?? null,
    }));
  }

  if (table === 'treinos' && columns.includes('treinos_exercicios(*, exercicios(*))')) {
    return rows.map((treino) => ({
      ...treino,
      treinos_exercicios: db.treinos_exercicios
        .filter((item) => item.treino_id === treino.id)
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          ...item,
          exercicios: db.exercicios.find((exercicio) => exercicio.id === item.exercicio_id) ?? null,
        })),
    }));
  }

  if (table === 'videos_correcao' && columns.includes('treinos_exercicios(*)')) {
    return rows.map((video) => ({
      ...video,
      treinos_exercicios:
        db.treinos_exercicios.find((item) => item.id === video.treino_exercicio_id) ?? null,
    }));
  }

  return rows;
};

const from = (table) => {
  const db = loadDatabase();

  let _filters = [];
  let _eqFilters = [];
  let _limit = null;
  let _single = false;
  let _columns = '*';
  let _operation = 'select';
  let _payload = null;

  const matchesFilters = (item) => _eqFilters.every(({ column, value }) => item[column] === value);

  const applyFilters = (data) => {
    let result = data;
    for (const filter of _filters) {
      result = filter(result);
    }
    return result;
  };

  const execute = async () => {
    await delay(160);

    const database = loadDatabase();
    const tableData = database[table];
    if (!Array.isArray(tableData)) {
      return { data: null, error: { message: `Tabela ${table} não encontrada.` } };
    }

    if (_operation === 'insert') {
      const rows = Array.isArray(_payload) ? _payload : [_payload];
      const inserted = rows.map((row) => ({ ...row }));
      tableData.push(...inserted);
      persistDatabase();
      return { data: inserted, error: null };
    }

    if (_operation === 'update') {
      const updatedRows = [];
      database[table] = tableData.map((item) => {
        if (matchesFilters(item)) {
          const updated = { ...item, ..._payload };
          updatedRows.push(clone(updated));
          return updated;
        }
        return item;
      });
      persistDatabase();
      return { data: updatedRows, error: null };
    }

    if (_operation === 'delete') {
      const remaining = [];
      const deleted = [];
      for (const item of tableData) {
        if (matchesFilters(item)) {
          deleted.push(clone(item));
        } else {
          remaining.push(item);
        }
      }
      database[table] = remaining;
      persistDatabase();
      return { data: deleted, error: null };
    }

    let results = clone(tableData);
    results = applyFilters(results);
    results = applyPolicies(table, results, database);
    results = hydrateColumns(table, results, _columns, database);

    if (_limit != null) {
      results = results.slice(0, _limit);
    }

    if (_single) {
      const data = results[0] ?? null;
      const error = results.length > 1 ? { message: 'Multiple rows returned' } : null;
      return { data, error };
    }

    return { data: results, error: null };
  };

  const builder = {
    select(columns = '*') {
      if (_operation !== 'select') return this;
      _columns = columns;
      return this;
    },
    insert(payload) {
      _operation = 'insert';
      _payload = payload;
      return this;
    },
    update(payload) {
      _operation = 'update';
      _payload = payload;
      return this;
    },
    delete() {
      _operation = 'delete';
      return this;
    },
    eq(column, value) {
      _filters.push((data) => data.filter((item) => item[column] === value));
      _eqFilters.push({ column, value });
      return this;
    },
    in(column, values) {
      _filters.push((data) => data.filter((item) => values.includes(item[column])));
      return this;
    },
    limit(count) {
      _limit = count;
      return this;
    },
    single() {
      _single = true;
      return this;
    },
    then(onfulfilled, onrejected) {
      return execute().then(onfulfilled, onrejected);
    },
    catch(onrejected) {
      return execute().catch(onrejected);
    },
    finally(onfinally) {
      return execute().finally(onfinally);
    },
  };

  return builder;
};

export const supabase = {
  auth,
  from,
};

