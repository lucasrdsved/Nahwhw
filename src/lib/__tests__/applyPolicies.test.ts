import { beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('applyPolicies', () => {
  let storage: Storage;

  beforeEach(async () => {
    vi.resetModules();
    ({ storage } = await import('../mockUtils'));
    storage.remove(SESSION_KEY);
    storage.remove(STORAGE_KEY);
  });

  it("allows an 'aluno' to load their own user row when the table lacks a user_id column", async () => {
    const { supabase } = await import('../apiMock');
    const signInResult = await supabase.auth.signIn({ email: 'matheus.alves@teste.com' });

    expect(signInResult.error).toBeNull();
    expect(signInResult.data?.user.id).toBe('u2');

    const { data, error } = await supabase.from('users').select('*');

    expect(error).toBeNull();
    expect(data).toEqual([
      {
        email: 'matheus.alves@teste.com',
        id: 'u2',
      },
    ]);
  });

  it("limits a 'personal' to relational rows that belong to their alunos", async () => {
    const { mockDB } = await import('../mockDB');
    const foreignAluno = {
      ...mockDB.alunos[0],
      id: 'a_foreign',
      personal_id: 'p_other',
      profile_id: 'p4',
    };
    const foreignVideo = {
      ...mockDB.videos_correcao[0],
      id: 'vc_foreign',
      aluno_id: foreignAluno.id,
      treino_exercicio_id: 'te5',
    };

    storage.set(
      STORAGE_KEY,
      JSON.stringify({
        alunos: [...mockDB.alunos, foreignAluno],
        videos_correcao: [...mockDB.videos_correcao, foreignVideo],
      }),
    );

    const { supabase } = await import('../apiMock');
    const signInResult = await supabase.auth.signIn({ email: 'personal@teste.com' });

    expect(signInResult.error).toBeNull();

    const { data, error } = await supabase.from('videos_correcao').select('*, treinos_exercicios(*)');

    expect(error).toBeNull();
    expect(data).toHaveLength(2);
    const ids = (data ?? []).map((item) => item.id);
    expect(ids).not.toContain('vc_foreign');
    for (const video of data ?? []) {
      expect(video.treinos_exercicios).not.toBeNull();
      expect(video.treinos_exercicios?.id).toBeDefined();
    }
  });
});
