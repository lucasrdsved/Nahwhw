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

/**
 * Builds a mock authenticated Supabase session for the provided user/profile pair.
 *
 * @param user - User record returned from the mock database.
 * @param profile - Profile record associated with the user.
 * @returns A fully populated mock `Session` object ready to be cached.
 */
const buildSession = (user: User, profile: Profile): Session => ({
  access_token: `mock_${Date.now()}`,
  user,
  profile,
});

export const auth = {
  /**
   * Signs a user into the mock authentication provider using their email address.
   *
   * @param params - Sign in parameters containing the email to authenticate.
   * @returns A promise resolving with the authenticated user/session pair or an error message.
   */
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

  /**
   * Retrieves the cached mock session for the current browser context.
   *
   * @returns A promise resolving with the session if available, otherwise `null`.
   */
  async getSession(): Promise<AuthResponse<{ session: Session | null }>> {
    await delay(120);
    const session = readJSON<Session>(SESSION_KEY);
    return { data: { session: session ?? null }, error: null };
  },

  /**
   * Clears the cached mock session data, simulating a Supabase sign-out operation.
   *
   * @returns A promise resolving when the session cache has been removed.
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    await delay(120);
    storage.remove(SESSION_KEY);
    return { error: null };
  },
};
