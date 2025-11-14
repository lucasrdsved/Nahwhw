import type {
  Aluno,
  Exercicio,
  Feedback,
  Medida,
  Profile,
  Progresso,
  Treino,
  TreinoExercicio,
  User,
  VideoCorrecao,
} from '@/types';

export interface MockDatabase {
  users: User[];
  profiles: Profile[];
  alunos: Aluno[];
  treinos: Treino[];
  exercicios: Exercicio[];
  treinos_exercicios: TreinoExercicio[];
  medidas: Medida[];
  progresso: Progresso[];
  feedback: Feedback[];
  videos_correcao: VideoCorrecao[];
}

const currentDay = new Date();
const currentWeekday = currentDay.getDay();

/**
 * Calculates the weekday index by applying an offset relative to the current day.
 *
 * @param offset - Number of days to offset from today (can be negative).
 * @returns Weekday number (0-6) adjusted for the provided offset.
 */
const weekDay = (offset: number): number => {
  return (currentWeekday + offset + 7) % 7;
};

const users: User[] = [
  { id: 'u1', email: 'personal@teste.com' },
  { id: 'u2', email: 'matheus.alves@teste.com' },
  { id: 'u3', email: 'joana.melo@teste.com' },
  { id: 'u4', email: 'carla.sousa@teste.com' },
];

const profiles: Profile[] = [
  {
    id: 'p1',
    user_id: 'u1',
    role: 'personal',
    full_name: 'Lucas Personal',
    avatar_url: '/avatars/lucas-personal.svg',
    bio: 'Personal trainer especializado em performance híbrida.',
  },
  {
    id: 'p2',
    user_id: 'u2',
    role: 'aluno',
    full_name: 'Matheus Alves',
    avatar_url: '/avatars/matheus-alves.svg',
    bio: 'Engenheiro apaixonado por treinos de força e corridas curtas.',
  },
  {
    id: 'p3',
    user_id: 'u3',
    role: 'aluno',
    full_name: 'Joana Melo',
    avatar_url: '/avatars/joana-melo.svg',
    bio: 'Empresária que transformou o treino funcional em estilo de vida.',
  },
  {
    id: 'p4',
    user_id: 'u4',
    role: 'aluno',
    full_name: 'Carla Sousa',
    avatar_url: '/avatars/carla-sousa.svg',
    bio: 'Fisioterapeuta buscando equilíbrio entre força e mobilidade.',
  },
];

const alunos: Aluno[] = [
  {
    id: 'a1',
    personal_id: 'p1',
    profile_id: 'p2',
    objetivo: 'Hipertrofia',
    idade: 27,
    peso_atual_kg: 84,
    altura_m: 1.78,
    progresso_meta: { semana: 68, meta: 100 },
    marcadores: ['Peitoral', 'Tríceps', 'Mobilidade de ombros'],
  },
  {
    id: 'a2',
    personal_id: 'p1',
    profile_id: 'p3',
    objetivo: 'Condicionamento',
    idade: 31,
    peso_atual_kg: 64,
    altura_m: 1.65,
    progresso_meta: { semana: 54, meta: 90 },
    marcadores: ['Core', 'Resistência', 'Potência'],
  },
  {
    id: 'a3',
    personal_id: 'p1',
    profile_id: 'p4',
    objetivo: 'Performance',
    idade: 35,
    peso_atual_kg: 58,
    altura_m: 1.7,
    progresso_meta: { semana: 72, meta: 100 },
    marcadores: ['Mobilidade', 'Estabilidade', 'Força funcional'],
  },
];

const exercicios: Exercicio[] = [
  {
    id: 'e1',
    nome: 'Supino Reto',
    grupo: 'Peito',
    equipamento: 'Banco + Barra',
    imagem: '/exercicios/supino.svg',
    video: '/videos/supino.json',
    foco: 'Força máxima de peitoral',
  },
  {
    id: 'e2',
    nome: 'Agachamento Livre',
    grupo: 'Pernas',
    equipamento: 'Rack + Barra',
    imagem: '/exercicios/agachamento.svg',
    video: '/videos/agachamento.json',
    foco: 'Desenvolvimento de quadríceps e glúteos',
  },
  {
    id: 'e3',
    nome: 'Remada Curvada',
    grupo: 'Costas',
    equipamento: 'Barra Olímpica',
    imagem: '/exercicios/remada.svg',
    video: '/videos/remada.json',
    foco: 'Espessura de dorsais',
  },
  {
    id: 'e4',
    nome: 'Prancha Dinâmica',
    grupo: 'Core',
    equipamento: 'Peso corporal',
    imagem: '/exercicios/prancha.svg',
    video: '/videos/prancha.json',
    foco: 'Estabilidade total de core',
  },
  {
    id: 'e5',
    nome: 'Bike Sprint',
    grupo: 'Cardio',
    equipamento: 'Bike Ergométrica',
    imagem: '/exercicios/bike.svg',
    video: '/videos/bike.json',
    foco: 'Condicionamento metabólico',
  },
];

const treinos: Treino[] = [
  {
    id: 't1',
    aluno_id: 'a1',
    personal_id: 'p1',
    nome: 'Treino do Dia - Peitoral & Tríceps',
    dia_semana: weekDay(0),
    descricao: 'Sessão de força com foco em peitoral dominante.',
    objetivo: 'Aumentar carga em 5% nas próximas 4 semanas.',
  },
  {
    id: 't2',
    aluno_id: 'a2',
    personal_id: 'p1',
    nome: 'Funcional HIIT',
    dia_semana: weekDay(1),
    descricao: 'Circuito metabólico focado em condicionamento.',
    objetivo: 'Melhorar VO2 máx em 8%.',
  },
  {
    id: 't3',
    aluno_id: 'a3',
    personal_id: 'p1',
    nome: 'Mobilidade + Força',
    dia_semana: weekDay(2),
    descricao: 'Controle motor e estabilidade articular.',
    objetivo: 'Aprimorar padrões de movimento para performance esportiva.',
  },
];

const treinos_exercicios: TreinoExercicio[] = [
  {
    id: 'te1',
    treino_id: 't1',
    exercicio_id: 'e1',
    series: 4,
    repeticoes: '10',
    descanso_s: 60,
    carga_kg: 48,
    order: 1,
    intensidade: 'Zona 4',
  },
  {
    id: 'te2',
    treino_id: 't1',
    exercicio_id: 'e3',
    series: 3,
    repeticoes: '12',
    descanso_s: 50,
    carga_kg: 40,
    order: 2,
    intensidade: 'Zona 3',
  },
  {
    id: 'te3',
    treino_id: 't1',
    exercicio_id: 'e4',
    series: 3,
    repeticoes: '45s',
    descanso_s: 45,
    order: 3,
    intensidade: 'Zona 2',
  },
  {
    id: 'te4',
    treino_id: 't2',
    exercicio_id: 'e5',
    series: 5,
    repeticoes: '30s',
    descanso_s: 30,
    order: 1,
    intensidade: 'Zona 5',
  },
  {
    id: 'te5',
    treino_id: 't3',
    exercicio_id: 'e2',
    series: 4,
    repeticoes: '8',
    descanso_s: 90,
    carga_kg: 35,
    order: 1,
    intensidade: 'Zona 3',
  },
];

const medidas: Medida[] = [
  {
    id: 'm1',
    aluno_id: 'a1',
    created_at: new Date(currentDay.getFullYear(), currentDay.getMonth() - 2, 5).toISOString(),
    peso_kg: 85.2,
    altura_cm: 178,
    gordura_percentual: 19.8,
    braco_cm: 39,
    cintura_cm: 87,
    quadril_cm: 101,
  },
  {
    id: 'm2',
    aluno_id: 'a1',
    created_at: new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 5).toISOString(),
    peso_kg: 84,
    altura_cm: 178,
    gordura_percentual: 18.5,
    braco_cm: 40,
    cintura_cm: 85,
    quadril_cm: 100,
  },
  {
    id: 'm3',
    aluno_id: 'a2',
    created_at: new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 10).toISOString(),
    peso_kg: 64.7,
    altura_cm: 165,
    gordura_percentual: 24.1,
    cintura_cm: 73,
    quadril_cm: 97,
  },
];

const progresso: Progresso[] = [
  {
    id: 'pr1',
    aluno_id: 'a1',
    treino_id: 't1',
    treino_exercicio_id: 'te1',
    data: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 7).toISOString(),
    metricas: {
      series_concluidas: 4,
      repeticoes_totais: 40,
      carga_total_kg: 1920,
    },
    observacoes: 'Excelente estabilidade na última série.',
  },
  {
    id: 'pr2',
    aluno_id: 'a1',
    treino_id: 't1',
    treino_exercicio_id: 'te1',
    data: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 3).toISOString(),
    metricas: {
      series_concluidas: 4,
      repeticoes_totais: 40,
      carga_total_kg: 1968,
    },
    observacoes: 'Carga aumentada com técnica sólida.',
  },
  {
    id: 'pr3',
    aluno_id: 'a2',
    treino_id: 't2',
    treino_exercicio_id: 'te4',
    data: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 2).toISOString(),
    metricas: {
      series_concluidas: 5,
      tempo_total_s: 240,
    },
    observacoes: 'Melhor controle de respiração entre sprints.',
  },
];

const feedback: Feedback[] = [
  {
    id: 'fb1',
    aluno_id: 'a1',
    treino_id: 't1',
    treino_exercicio_id: 'te2',
    mensagem: 'Remada curvada ficou intensa, manter descanso de 50s.',
    avaliacao: 5,
    created_at: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 3).toISOString(),
  },
  {
    id: 'fb2',
    aluno_id: 'a2',
    treino_id: 't2',
    treino_exercicio_id: 'te4',
    mensagem: 'Pronto para aumentar intensidade da bike sprint.',
    avaliacao: 4,
    created_at: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 2).toISOString(),
  },
];

const videos_correcao: VideoCorrecao[] = [
  {
    id: 'vc1',
    aluno_id: 'a1',
    treino_exercicio_id: 'te1',
    video_url: '/videos/supino-correcao.json',
    thumbnail_url: '/exercicios/supino.svg',
    comentario: 'Ajustar retração escapular para manter estabilidade.',
    enviado_em: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 1).toISOString(),
  },
  {
    id: 'vc2',
    aluno_id: 'a2',
    treino_exercicio_id: 'te4',
    video_url: '/videos/bike.json',
    thumbnail_url: '/exercicios/bike.svg',
    comentario: 'Controlar a cadência final para reduzir fadiga.',
    enviado_em: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 1).toISOString(),
  },
];

export const mockDB: MockDatabase = {
  users,
  profiles,
  alunos,
  treinos,
  exercicios,
  treinos_exercicios,
  medidas,
  progresso,
  feedback,
  videos_correcao,
};
