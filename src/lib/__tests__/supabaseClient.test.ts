import { describe, expect, it, vi } from 'vitest';

import type { MockDatabase } from '../mockDB';

vi.mock('../mockUtils', async () => {
  const actual = await vi.importActual<typeof import('../mockUtils')>('../mockUtils');
  return {
    ...actual,
    delay: () => Promise.resolve(),
  };
});

const SESSION_KEY = 'supabase.session';
const STORAGE_KEY = 'supabase.mock.db';

type Storage = typeof import('../mockUtils')['storage'];
type SupabaseClient = typeof import('../apiMock')['supabase'];

type ClientContext = {
  supabase: SupabaseClient;
  storage: Storage;
};

const createClient = async (persist?: Partial<MockDatabase>): Promise<ClientContext> => {
  vi.resetModules();
  const utils = await import('../mockUtils');
  const storage = utils.storage;
  storage.remove(SESSION_KEY);
  storage.remove(STORAGE_KEY);

  if (persist) {
    storage.set(STORAGE_KEY, JSON.stringify(persist));
  }

  const { supabase } = await import('../apiMock');
  return { supabase, storage };
};

describe('supabase mock client', () => {
  it('hydrates related data and sorts relational collections by order', async () => {
    const { mockDB } = await import('../mockDB');
    const reversed = [...mockDB.treinos_exercicios].reverse();
    const { supabase } = await createClient({ treinos_exercicios: reversed });

    const { data, error } = await supabase
      .from('treinos')
      .select('*, treinos_exercicios(*, exercicios(*))')
      .eq('id', 't1');

    expect(error).toBeNull();
    expect(data).toHaveLength(1);

    const treino = data?.[0];
    const exercises = treino?.treinos_exercicios;

    expect(exercises).toBeDefined();
    expect(exercises).toHaveLength(3);
    expect(exercises?.map((item) => item.id)).toEqual(['te1', 'te2', 'te3']);
    for (const item of exercises ?? []) {
      expect(item.exercicios).not.toBeNull();
      expect(item.exercicios?.id).toBeDefined();
    }
  });

  it('supports insert, update and delete operations with persistence and filtering', async () => {
    const { supabase, storage } = await createClient();

    const novoAluno = {
      id: 'a_novo',
      personal_id: 'p1',
      profile_id: 'p2',
      objetivo: 'Hipertrofia avançada',
      idade: 24,
      peso_atual_kg: 82,
      altura_m: 1.79,
      progresso_meta: { semana: 12, meta: 24 },
      marcadores: ['Força', 'Volume'],
    };

    const insertResult = await supabase.from('alunos').insert(novoAluno);
    expect(insertResult.error).toBeNull();
    expect(insertResult.data).toEqual([novoAluno]);

    novoAluno.objetivo = 'alterado localmente';

    const { data: fetchedAfterInsert } = await supabase.from('alunos').select('*').eq('id', 'a_novo').limit(1);
    expect(fetchedAfterInsert).toEqual([
      expect.objectContaining({
        id: 'a_novo',
        objetivo: 'Hipertrofia avançada',
      }),
    ]);

    const snapshotAfterInsert = JSON.parse(storage.get(STORAGE_KEY) ?? '{}');
    expect((snapshotAfterInsert.alunos ?? []).some((item: { id: string }) => item.id === 'a_novo')).toBe(true);

    const updateResult = await supabase.from('alunos').update({ idade: 28 }).eq('id', 'a_novo');
    expect(updateResult.error).toBeNull();
    expect(updateResult.data).toEqual([
      expect.objectContaining({ id: 'a_novo', idade: 28 }),
    ]);

    const deleteResult = await supabase.from('alunos').delete().eq('id', 'a_novo');
    expect(deleteResult.error).toBeNull();
    expect(deleteResult.data).toEqual([
      expect.objectContaining({ id: 'a_novo' }),
    ]);

    const { data: afterDelete } = await supabase.from('alunos').select('*').eq('id', 'a_novo');
    expect(afterDelete).toEqual([]);

    const snapshotAfterDelete = JSON.parse(storage.get(STORAGE_KEY) ?? '{}');
    expect((snapshotAfterDelete.alunos ?? []).some((item: { id: string }) => item.id === 'a_novo')).toBe(false);
  });

  it('returns an error when single is requested but multiple rows match', async () => {
    const { supabase } = await createClient();

    const { data, error } = await supabase.from('alunos').select('*').single();

    expect(data).toBeDefined();
    expect(error).toEqual({ message: 'Multiple rows returned' });
  });

  it('applies inclusion filters with the in operator', async () => {
    const { supabase } = await createClient();

    const { data, error } = await supabase
      .from('treinos_exercicios')
      .select('*')
      .in('id', ['te1', 'te3', 'does-not-exist']);

    expect(error).toBeNull();
    expect(data).toHaveLength(2);
    expect(data?.map((item) => item.id).sort()).toEqual(['te1', 'te3']);
  });

  it('manages authentication sessions end-to-end', async () => {
    const { supabase, storage } = await createClient();

    const failedSignIn = await supabase.auth.signIn({ email: 'unknown@teste.com' });
    expect(failedSignIn.data).toBeNull();
    expect(failedSignIn.error).toEqual({ message: 'Credenciais inválidas.' });

    const successfulSignIn = await supabase.auth.signIn({ email: 'matheus.alves@teste.com' });
    expect(successfulSignIn.error).toBeNull();
    expect(successfulSignIn.data?.session.profile.id).toBe('p2');

    const persistedSession = JSON.parse(storage.get(SESSION_KEY) ?? 'null');
    expect(persistedSession?.profile?.id).toBe('p2');

    const sessionResult = await supabase.auth.getSession();
    expect(sessionResult.error).toBeNull();
    expect(sessionResult.data?.session?.profile.id).toBe('p2');

    const signOutResult = await supabase.auth.signOut();
    expect(signOutResult.error).toBeNull();
    expect(storage.get(SESSION_KEY)).toBeNull();

    const sessionAfterSignOut = await supabase.auth.getSession();
    expect(sessionAfterSignOut.data?.session).toBeNull();
  });
});
