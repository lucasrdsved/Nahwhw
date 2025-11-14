import type { Session, User, Profile } from '@/types';

import { mockDB } from './mockDB';
import { delay, readJSON, storage, writeJSON } from './mockUtils';

const SESSION_KEY = 'supabase.session';

type AuthError = { message: string };

interface AuthResponse<T> {
  data: T | null;
  error: AuthError | null;
}

interface SignInParams {
  email: string;
}

const buildSession = (user: User, profile: Profile): Session => ({
  access_token: `mock_${Date.now()}`,
  user,
  profile,
});

export const auth = {
  async signIn({ email }: SignInParams): Promise<AuthResponse<{ user: User; session: Session }>> {
    await delay(320);

    const user = mockDB.users.find((item) => item.email === email);
    if (!user) {
      return { data: null, error: { message: 'Credenciais inválidas.' } };
    }

    const profile = mockDB.profiles.find((item) => item.user_id === user.id);
    if (!profile) {
      return { data: null, error: { message: 'Perfil não localizado.' } };
    }

    const session = buildSession(user, profile);

    writeJSON(SESSION_KEY, session);

    return { data: { user, session }, error: null };
  },

  async getSession(): Promise<AuthResponse<{ session: Session | null }>> {
    await delay(120);
    const session = readJSON<Session>(SESSION_KEY);
    return { data: { session: session ?? null }, error: null };
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    await delay(120);
    storage.remove(SESSION_KEY);
    return { error: null };
  },
};
