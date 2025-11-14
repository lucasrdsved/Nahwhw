// /lib/mockDB.ts
// Este arquivo simula seu banco de dados Supabase.
import { User, Profile, Aluno, Exercicio, Treino, TreinoExercicio, Medida } from '@/types';

const users: User[] = [
  { id: 'user_personal_1', email: 'personal@evofit.com' },
  { id: 'user_aluno_1', email: 'bruno@evofit.com' },
  { id: 'user_aluno_2', email: 'carla@evofit.com' },
];

const profiles: Profile[] = [
  { id: 'profile_personal_1', user_id: 'user_personal_1', role: 'personal', full_name: 'Alex Costa', avatar_url: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'profile_aluno_1', user_id: 'user_aluno_1', role: 'aluno', full_name: 'Bruno Silva', avatar_url: 'https://picsum.photos/seed/bruno/100/100' },
  { id: 'profile_aluno_2', user_id: 'user_aluno_2', role: 'aluno', full_name: 'Carla Dias', avatar_url: 'https://picsum.photos/seed/carla/100/100' },
];

const alunos: Omit<Aluno, 'profiles'>[] = [
  { id: 'aluno_1', personal_id: 'profile_personal_1', profile_id: 'profile_aluno_1', objetivo: 'hipertrofia' },
  { id: 'aluno_2', personal_id: 'profile_personal_1', profile_id: 'profile_aluno_2', objetivo: 'emagrecimento' },
];

const exercicios: Exercicio[] = [
  { id: 'ex001', nome: 'Supino Reto com Barra', descricao: 'Principal exercício para peitoral.', grupo_muscular: 'Peitoral', equipamento: 'Barra e Banco', thumbnail_url: 'https://picsum.photos/seed/supino/800/600' },
  { id: 'ex002', nome: 'Agachamento Livre', descricao: 'Exercício fundamental para pernas.', grupo_muscular: 'Pernas', equipamento: 'Barra', thumbnail_url: 'https://picsum.photos/seed/agachamento/800/600' },
  { id: 'ex003', nome: 'Remada Curvada', descricao: 'Ótimo para densidade nas costas.', grupo_muscular: 'Costas', equipamento: 'Barra', thumbnail_url: 'https://picsum.photos/seed/remada/800/600' },
  { id: 'ex004', nome: 'Elevação Lateral', descricao: 'Foco na porção medial dos ombros.', grupo_muscular: 'Ombros', equipamento: 'Halteres', thumbnail_url: 'https://picsum.photos/seed/elevacao/800/600' },
  { id: 'ex005', nome: 'Leg Press 45°', descricao: 'Excelente para quadríceps e glúteos.', grupo_muscular: 'Pernas', equipamento: 'Máquina', thumbnail_url: 'https://picsum.photos/seed/legpress/800/600' },
];

const treinos: Omit<Treino, 'treinos_exercicios'>[] = [
  { id: 'tr001', aluno_id: 'profile_aluno_1', personal_id: 'profile_personal_1', nome: 'Treino A - Superior Forte', dia_semana: 1 },
  { id: 'tr002', aluno_id: 'profile_aluno_1', personal_id: 'profile_personal_1', nome: 'Treino B - Pernas e Ombros', dia_semana: 2 },
  { id: 'tr003', aluno_id: 'profile_aluno_2', personal_id: 'profile_personal_1', nome: 'Treino Full Body Fit', dia_semana: 1 },
];

const treinos_exercicios: Omit<TreinoExercicio, 'exercicios'>[] = [
  // Treino 1 - Bruno
  { id: 'te01', treino_id: 'tr001', exercicio_id: 'ex001', series: 4, repeticoes: '8-12', descanso_s: 60, order: 1 },
  { id: 'te02', treino_id: 'tr001', exercicio_id: 'ex003', series: 3, repeticoes: '10', descanso_s: 60, order: 2, instrucoes: "Foco na contração das escápulas." },
  { id: 'te03', treino_id: 'tr001', exercicio_id: 'ex004', series: 4, repeticoes: '15', descanso_s: 45, order: 3 },
  // Treino 2 - Bruno
  { id: 'te04', treino_id: 'tr002', exercicio_id: 'ex002', series: 4, repeticoes: '8-10', descanso_s: 90, order: 1 },
  { id: 'te05', treino_id: 'tr002', exercicio_id: 'ex005', series: 3, repeticoes: '12-15', descanso_s: 75, order: 2 },
  // Treino 3 - Carla
  { id: 'te06', treino_id: 'tr003', exercicio_id: 'ex002', series: 3, repeticoes: '15', descanso_s: 60, order: 1 },
  { id: 'te07', treino_id: 'tr003', exercicio_id: 'ex001', series: 3, repeticoes: '15', descanso_s: 60, order: 2 },
];

const medidas: Medida[] = [
    { id: 'm001', aluno_id: 'profile_aluno_1', created_at: new Date().toISOString(), peso_kg: 85, altura_cm: 180 },
];

export const mockDB = {
  users,
  profiles,
  alunos,
  exercicios,
  treinos,
  treinos_exercicios,
  medidas,
};
