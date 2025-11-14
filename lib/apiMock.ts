
import { mockDB } from './mockDB';
import { auth } from './authMock';
import { delay } from './utils';

type TableKey = keyof typeof mockDB;

// This makes the builder await-able.
type QueryBuilder = {
  select(columns?: string): QueryBuilder;
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
  let _limit: number | null = null;
  let _single: boolean = false;
  let _columns: string = '*';

  const execute = async () => {
    await delay(150);
    
    let results: any[] = JSON.parse(JSON.stringify(mockDB[table]));

    // Apply filters
    for (const filter of _filters) {
      results = filter(results);
    }

    // Simula RLS
    const sessionStr = localStorage.getItem('supabase.session');
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

    // Simula joins
    if (_columns.includes('profiles(*)')) {
      results = results.map((item: any) => ({
        ...item,
        profiles: mockDB.profiles.find(p => p.id === item.profile_id)
      }));
    }
    if (_columns.includes('treinos_exercicios(*, exercicios(*))')) {
        results = results.map((treino: any) => ({
            ...treino,
            treinos_exercicios: mockDB.treinos_exercicios
                .filter(te => te.treino_id === treino.id)
                .map(te => ({
                    ...te,
                    exercicios: mockDB.exercicios.find(e => e.id === te.exercicio_id)
                }))
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
      _columns = columns;
      return this;
    },
    
    eq(column: string, value: any) {
      _filters.push((data) => data.filter(item => item[column] === value));
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


export const supabase = {
  auth,
  from,
};