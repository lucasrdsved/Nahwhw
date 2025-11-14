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
  bio?: string;
}

export type ObjetivoAluno = 'Hipertrofia' | 'Condicionamento' | 'Performance' | 'Emagrecimento' | string;

export interface ProgressoMeta {
  semana: number;
  meta: number;
}

export interface Aluno {
  id: string;
  personal_id: string;
  profile_id: string;
  objetivo: ObjetivoAluno;
  idade?: number;
  peso_atual_kg?: number;
  altura_m?: number;
  progresso_meta?: ProgressoMeta;
  marcadores?: string[];
  profiles?: Profile | null;
}

export interface Medida {
  id: string;
  aluno_id: string;
  created_at: string;
  peso_kg: number;
  altura_cm: number;
  gordura_percentual?: number;
  braco_cm?: number;
  cintura_cm?: number;
  quadril_cm?: number;
  alunos?: Aluno;
}

export interface Exercicio {
  id: string;
  nome: string;
  grupo: string;
  equipamento: string;
  imagem?: string;
  video?: string;
  foco?: string;
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
  observacoes_personal?: string;
  intensidade?: string;
  exercicios?: Exercicio | null; // Relação com Exercicio
}

export interface Treino {
  id: string;
  aluno_id: string;
  personal_id: string;
  nome: string;
  dia_semana: number;
  descricao?: string;
  objetivo?: string;
  treinos_exercicios?: TreinoExercicio[];
}

export interface ProgressoMetricas {
  series_concluidas?: number;
  repeticoes_totais?: number;
  carga_total_kg?: number;
  tempo_total_s?: number;
}

export interface Progresso {
  id: string;
  aluno_id: string;
  treino_id: string | null;
  treino_exercicio_id?: string | null;
  data: string;
  metricas: ProgressoMetricas;
  observacoes?: string;
  alunos?: Aluno;
  treinos?: Treino;
  treinos_exercicios?: TreinoExercicio;
}

export interface Feedback {
  id: string;
  aluno_id: string;
  treino_id: string | null;
  treino_exercicio_id?: string | null;
  mensagem: string;
  avaliacao?: number;
  created_at: string;
  alunos?: Aluno;
  treinos?: Treino;
  treinos_exercicios?: TreinoExercicio;
}

export interface VideoCorrecao {
  id: string;
  aluno_id: string;
  treino_exercicio_id: string;
  video_url: string;
  thumbnail_url?: string;
  comentario?: string;
  enviado_em: string;
  alunos?: Aluno;
  treinos_exercicios?: TreinoExercicio;
}
