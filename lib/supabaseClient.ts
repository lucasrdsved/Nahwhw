// Este arquivo é o ponto central para interagir com o "Supabase".
// Para mudar para o Supabase real, comente a linha do 'apiMock'
// e descomente a configuração do cliente Supabase real.

// --- MOCK CLIENT (USADO ATUALMENTE) ---
export * from './apiMock';

// --- REAL SUPABASE CLIENT (PARA USAR NO FUTURO) ---
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Adicione o tipo do seu DB se estiver usando 'supabase gen types'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/
