// @ts-check
import { mockDB } from './mockDB';
import { delay, readJSON, writeJSON, storage } from './mockUtils';

const SESSION_KEY = 'supabase.session';

export const auth = {
  async signIn({ email }) {
    await delay(320);

    const user = mockDB.users.find((item) => item.email === email);
    if (!user) {
      return { data: null, error: { message: 'Credenciais inválidas.' } };
    }

    const profile = mockDB.profiles.find((item) => item.user_id === user.id);
    if (!profile) {
      return { data: null, error: { message: 'Perfil não localizado.' } };
    }

    const session = {
      access_token: `mock_${Date.now()}`,
      user,
      profile,
    };

    writeJSON(SESSION_KEY, session);

    return { data: { user, session }, error: null };
  },

  async getSession() {
    await delay(120);
    const session = readJSON(SESSION_KEY);
    return { data: { session: session ?? null }, error: null };
  },

  async signOut() {
    await delay(120);
    storage.remove(SESSION_KEY);
    return { error: null };
  },
};
