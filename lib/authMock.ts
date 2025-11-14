import { mockDB } from './mockDB';
import { delay } from './utils';
import { Session } from '@/types';

export const auth = {
  signInWithPassword: async ({ email, password }: { email: string, password?: string }) => {
    await delay(300);

    const user = mockDB.users.find((u) => u.email === email);
    if (!user) {
      return { data: null, error: { message: 'Credenciais inválidas' } };
    }

    const profile = mockDB.profiles.find((p) => p.user_id === user.id);
    if (!profile) {
        return { data: null, error: { message: 'Perfil não encontrado para este usuário.'}};
    }

    const session: Session = {
      access_token: `mock_token_${Date.now()}`,
      user,
      profile,
    };
    
    localStorage.setItem('supabase.session', JSON.stringify(session));

    return { data: { session }, error: null };
  },

  getSession: async () => {
    await delay(50);
    const sessionStr = localStorage.getItem('supabase.session');
    
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      return { data: { session }, error: null };
    }
    
    return { data: { session: null }, error: null };
  },

  signOut: async () => {
    await delay(100);
    localStorage.removeItem('supabase.session');
    return { error: null };
  },
};
