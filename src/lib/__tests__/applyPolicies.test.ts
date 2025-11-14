import { beforeEach, describe, expect, it } from 'vitest';

import { supabase } from '../apiMock';
import { storage } from '../mockUtils';

const SESSION_KEY = 'supabase.session';
const STORAGE_KEY = 'supabase.mock.db';

describe('applyPolicies', () => {
  beforeEach(() => {
    storage.remove(SESSION_KEY);
    storage.remove(STORAGE_KEY);
  });

  it("allows an 'aluno' to load their own user row when the table lacks a user_id column", async () => {
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
});
