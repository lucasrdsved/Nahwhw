
export type UserRole = 'personal' | 'aluno';

export interface User {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
  user: User;
  profile: Profile;
}

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
}

export interface Aluno {
  id:string;
  personal_id: string;
  profile_id: string;
  objetivo: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'performance';
  profiles: Profile; // Relação com Profile
}

export interface Medida {
  id: string; 
  aluno_id: string;
  created_at: string; 
  peso_kg: number;
  altura_cm: number;
}

export interface Exercicio {
  id: string; 
  nome: string;
  descricao: string;
  grupo_muscular: string;
  equipamento: string;
  video_url?: string;
  thumbnail_url?: string;
}

export interface TreinoExercicio {
  id: string;
  treino_id: string;
  exercicio_id: string;
  series: number;
  repeticoes: string;
  carga_kg?: number;
  descanso_s: number;
  instrucoes?: string;
  order: number;
  exercicios: Exercicio; // Relação com Exercicio
}

export interface Treino {
  id: string; 
  aluno_id: string;
  personal_id: string;
  nome: string; 
  dia_semana: number;
  treinos_exercicios: TreinoExercicio[]; // Relação com TreinoExercicio
}
