// /lib/mockDB.ts
// Este arquivo simula seu banco de dados Supabase.
import {
  User,
  Profile,
  Aluno,
  Exercicio,
  Treino,
  TreinoExercicio,
  Medida,
  Progresso,
  Feedback,
  VideoCorrecao,
} from '@/types';

type MockTableMap = {
  users: User[];
  profiles: Profile[];
  alunos: Omit<Aluno, 'profiles'>[];
  exercicios: Exercicio[];
  treinos: Omit<Treino, 'treinos_exercicios'>[];
  treinos_exercicios: Omit<TreinoExercicio, 'exercicios'>[];
  medidas: Medida[];
  progresso: Progresso[];
  feedback: Feedback[];
  videos_correcao: VideoCorrecao[];
};

const currentWeekday = new Date().getDay();
const nextWeekday = (currentWeekday + 2) % 7;
const upcomingWeekday = (currentWeekday + 1) % 7;

const users: MockTableMap['users'] = [
  { id: 'user_personal_1', email: 'personal@teste.com' },
  { id: 'user_aluno_1', email: 'matheus.alves@teste.com' },
  { id: 'user_aluno_2', email: 'joana.melo@teste.com' },
];

const profiles: MockTableMap['profiles'] = [
  {
    id: 'profile_personal_1',
    user_id: 'user_personal_1',
    role: 'personal',
    full_name: 'Eduardo Martins',
    avatar_url: 'https://picsum.photos/seed/eduardo/160/160',
  },
  {
    id: 'profile_aluno_1',
    user_id: 'user_aluno_1',
    role: 'aluno',
    full_name: 'Matheus Alves',
    avatar_url: 'https://picsum.photos/seed/matheus/160/160',
  },
  {
    id: 'profile_aluno_2',
    user_id: 'user_aluno_2',
    role: 'aluno',
    full_name: 'Joana Melo',
    avatar_url: 'https://picsum.photos/seed/joana/160/160',
  },
];

const alunos: MockTableMap['alunos'] = [
  {
    id: 'aluno_matheus',
    personal_id: 'profile_personal_1',
    profile_id: 'profile_aluno_1',
    objetivo: 'hipertrofia',
  },
  {
    id: 'aluno_joana',
    personal_id: 'profile_personal_1',
    profile_id: 'profile_aluno_2',
    objetivo: 'condicionamento',
  },
];

const exercicios: MockTableMap['exercicios'] = [
  {
    id: 'ex_supino_reto',
    nome: 'Supino Reto',
    descricao: 'Deitado no banco, desça a barra na direção do peito e retorne controladamente.',
    grupo_muscular: 'Peitoral',
    equipamento: 'Barra e Banco',
    thumbnail_url: 'https://picsum.photos/seed/supino/800/600',
    video_url: 'https://videos.teste.com/supino-reto.mp4',
  },
  {
    id: 'ex_desenvolvimento_halteres',
    nome: 'Desenvolvimento com Halteres',
    descricao: 'Sentado, empurre os halteres acima da cabeça e desça lentamente.',
    grupo_muscular: 'Ombros',
    equipamento: 'Halteres',
    thumbnail_url: 'https://picsum.photos/seed/desenvolvimento/800/600',
  },
  {
    id: 'ex_flexao_diamante',
    nome: 'Flexão Diamante',
    descricao: 'Flexões com as mãos próximas, ativando tríceps e porção interna do peitoral.',
    grupo_muscular: 'Tríceps',
    equipamento: 'Peso corporal',
    thumbnail_url: 'https://picsum.photos/seed/flexao/800/600',
  },
  {
    id: 'ex_agachamento_livre',
    nome: 'Agachamento Livre',
    descricao: 'Com a barra apoiada nos ombros, agache até que as coxas fiquem paralelas ao solo.',
    grupo_muscular: 'Pernas',
    equipamento: 'Barra',
    thumbnail_url: 'https://picsum.photos/seed/agachamento/800/600',
    video_url: 'https://videos.teste.com/agachamento.mp4',
  },
  {
    id: 'ex_prancha',
    nome: 'Prancha Isométrica',
    descricao: 'Apoie os antebraços no solo mantendo o corpo alinhado e o core contraído.',
    grupo_muscular: 'Core',
    equipamento: 'Peso corporal',
    thumbnail_url: 'https://picsum.photos/seed/prancha/800/600',
  },
];

const treinos: MockTableMap['treinos'] = [
  {
    id: 'treino_matheus_peitoral',
    aluno_id: 'profile_aluno_1',
    personal_id: 'profile_personal_1',
    nome: 'Treino do Dia - Peitoral e Tríceps',
    dia_semana: currentWeekday,
    descricao: 'Sessão focada em força e hipertrofia para membros superiores.',
    objetivo: 'Desenvolver peitoral e tríceps com ênfase em execução controlada.',
  },
  {
    id: 'treino_matheus_pernas',
    aluno_id: 'profile_aluno_1',
    personal_id: 'profile_personal_1',
    nome: 'Treino de Pernas Explosivas',
    dia_semana: nextWeekday,
    descricao: 'Foco em pernas e glúteos com movimentos compostos.',
    objetivo: 'Ganho de força e estabilidade nos membros inferiores.',
  },
  {
    id: 'treino_joana_fullbody',
    aluno_id: 'profile_aluno_2',
    personal_id: 'profile_personal_1',
    nome: 'Full Body Funcional',
    dia_semana: upcomingWeekday,
    descricao: 'Circuito funcional para condicionamento geral.',
    objetivo: 'Melhorar condicionamento cardiorrespiratório e força geral.',
  },
];

const treinos_exercicios: MockTableMap['treinos_exercicios'] = [
  {
    id: 'te_supino_reto',
    treino_id: 'treino_matheus_peitoral',
    exercicio_id: 'ex_supino_reto',
    series: 4,
    repeticoes: '8-10',
    descanso_s: 90,
    carga_kg: 40,
    order: 1,
    instrucoes: 'Mantenha os pés firmes no chão e controle a descida da barra.',
  },
  {
    id: 'te_desenvolvimento_halteres',
    treino_id: 'treino_matheus_peitoral',
    exercicio_id: 'ex_desenvolvimento_halteres',
    series: 3,
    repeticoes: '10-12',
    descanso_s: 60,
    carga_kg: 18,
    order: 2,
    instrucoes: 'Evite arquear a lombar durante o movimento.',
  },
  {
    id: 'te_flexao_diamante',
    treino_id: 'treino_matheus_peitoral',
    exercicio_id: 'ex_flexao_diamante',
    series: 3,
    repeticoes: 'max',
    descanso_s: 45,
    order: 3,
  },
  {
    id: 'te_agachamento',
    treino_id: 'treino_matheus_pernas',
    exercicio_id: 'ex_agachamento_livre',
    series: 5,
    repeticoes: '6-8',
    descanso_s: 120,
    carga_kg: 60,
    order: 1,
    instrucoes: 'Mantenha o abdômen contraído e desça até 90 graus.',
  },
  {
    id: 'te_prancha',
    treino_id: 'treino_joana_fullbody',
    exercicio_id: 'ex_prancha',
    series: 4,
    repeticoes: '45s',
    descanso_s: 45,
    order: 1,
    instrucoes: 'Controle a respiração e evite elevar o quadril.',
  },
];

const medidas: MockTableMap['medidas'] = [
  {
    id: 'med_matheus_2024_03_01',
    aluno_id: 'profile_aluno_1',
    created_at: new Date('2024-03-01T08:30:00Z').toISOString(),
    peso_kg: 82.4,
    altura_cm: 178,
    gordura_percentual: 18.5,
    braco_cm: 38,
    cintura_cm: 87,
    quadril_cm: 99,
  },
  {
    id: 'med_matheus_2024_04_01',
    aluno_id: 'profile_aluno_1',
    created_at: new Date('2024-04-01T08:30:00Z').toISOString(),
    peso_kg: 83.2,
    altura_cm: 178,
    gordura_percentual: 17.9,
    braco_cm: 39,
    cintura_cm: 85,
    quadril_cm: 100,
  },
  {
    id: 'med_joana_2024_03_15',
    aluno_id: 'profile_aluno_2',
    created_at: new Date('2024-03-15T09:00:00Z').toISOString(),
    peso_kg: 64.1,
    altura_cm: 165,
    gordura_percentual: 24.3,
    cintura_cm: 74,
    quadril_cm: 96,
  },
];

const progresso: MockTableMap['progresso'] = [
  {
    id: 'prog_supino_01',
    aluno_id: 'profile_aluno_1',
    treino_id: 'treino_matheus_peitoral',
    treino_exercicio_id: 'te_supino_reto',
    data: new Date('2024-04-08T12:00:00Z').toISOString(),
    metricas: {
      series_concluidas: 4,
      repeticoes_totais: 36,
      carga_total_kg: 1440,
    },
    observacoes: 'Boa estabilização, manter carga na próxima semana.',
  },
  {
    id: 'prog_agachamento_01',
    aluno_id: 'profile_aluno_1',
    treino_id: 'treino_matheus_pernas',
    treino_exercicio_id: 'te_agachamento',
    data: new Date('2024-04-09T12:00:00Z').toISOString(),
    metricas: {
      series_concluidas: 5,
      repeticoes_totais: 35,
      carga_total_kg: 2100,
    },
    observacoes: 'Aumentar 2kg na próxima sessão se mantiver técnica.',
  },
  {
    id: 'prog_prancha_01',
    aluno_id: 'profile_aluno_2',
    treino_id: 'treino_joana_fullbody',
    treino_exercicio_id: 'te_prancha',
    data: new Date('2024-04-10T11:00:00Z').toISOString(),
    metricas: {
      series_concluidas: 4,
      tempo_total_s: 180,
    },
    observacoes: 'Excelente estabilidade no core.',
  },
];

const feedback: MockTableMap['feedback'] = [
  {
    id: 'fb_supino_01',
    aluno_id: 'profile_aluno_1',
    treino_id: 'treino_matheus_peitoral',
    treino_exercicio_id: 'te_supino_reto',
    mensagem: 'Supino reto foi desafiador na última série, reduzir 5kg na próxima sessão.',
    avaliacao: 4,
    created_at: new Date('2024-04-08T13:20:00Z').toISOString(),
  },
  {
    id: 'fb_agachamento_01',
    aluno_id: 'profile_aluno_1',
    treino_id: 'treino_matheus_pernas',
    treino_exercicio_id: 'te_agachamento',
    mensagem: 'Agachamento com ótima execução, possível aumentar carga gradualmente.',
    avaliacao: 5,
    created_at: new Date('2024-04-09T13:20:00Z').toISOString(),
  },
  {
    id: 'fb_prancha_01',
    aluno_id: 'profile_aluno_2',
    treino_id: 'treino_joana_fullbody',
    treino_exercicio_id: 'te_prancha',
    mensagem: 'Manter a respiração constante durante toda a série.',
    created_at: new Date('2024-04-10T12:05:00Z').toISOString(),
  },
];

const videos_correcao: MockTableMap['videos_correcao'] = [
  {
    id: 'vc_supino_01',
    aluno_id: 'profile_aluno_1',
    treino_exercicio_id: 'te_supino_reto',
    video_url: 'https://videos.teste.com/correcao-supino-matheus.mp4',
    thumbnail_url: 'https://picsum.photos/seed/correcao-supino/600/400',
    comentario: 'Ajustar a posição das escápulas para melhorar a estabilidade.',
    enviado_em: new Date('2024-04-08T14:00:00Z').toISOString(),
  },
  {
    id: 'vc_agachamento_01',
    aluno_id: 'profile_aluno_1',
    treino_exercicio_id: 'te_agachamento',
    video_url: 'https://videos.teste.com/correcao-agachamento-matheus.mp4',
    thumbnail_url: 'https://picsum.photos/seed/correcao-agachamento/600/400',
    comentario: 'Manter os joelhos alinhados com a ponta dos pés.',
    enviado_em: new Date('2024-04-09T14:00:00Z').toISOString(),
  },
  {
    id: 'vc_prancha_01',
    aluno_id: 'profile_aluno_2',
    treino_exercicio_id: 'te_prancha',
    video_url: 'https://videos.teste.com/correcao-prancha-joana.mp4',
    thumbnail_url: 'https://picsum.photos/seed/correcao-prancha/600/400',
    comentario: 'Evitar a elevação do quadril após 30 segundos.',
    enviado_em: new Date('2024-04-10T12:30:00Z').toISOString(),
  },
];

export const mockDB: MockTableMap = {
  users,
  profiles,
  alunos,
  exercicios,
  treinos,
  treinos_exercicios,
  medidas,
  progresso,
  feedback,
  videos_correcao,
};
