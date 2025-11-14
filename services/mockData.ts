
import { Treino, Profile, Aluno, Exercicio, TreinoExercicio } from '../types';

export const mockPersonalProfile: Profile = {
  id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  user_id: 'user_personal_123',
  role: 'personal',
  full_name: 'Alex Costa',
  avatar_url: 'https://picsum.photos/seed/alex/100/100',
};

export const mockAlunoProfile: Profile = {
  id: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  user_id: 'user_aluno_456',
  role: 'aluno',
  full_name: 'Bruno Silva',
  avatar_url: 'https://picsum.photos/seed/bruno/100/100',
};

export const mockAlunos: (Profile & { objetivo: Aluno['objetivo'] })[] = [
    { ...mockAlunoProfile, objetivo: 'hipertrofia' },
    { id: 'g1h2i3j4', user_id: 'user_aluno_789', role: 'aluno', full_name: 'Carla Dias', avatar_url: 'https://picsum.photos/seed/carla/100/100', objetivo: 'emagrecimento' },
    { id: 'k5l6m7n8', user_id: 'user_aluno_101', role: 'aluno', full_name: 'Daniela Souza', avatar_url: 'https://picsum.photos/seed/daniela/100/100', objetivo: 'condicionamento' },
];

const supinoReto: Exercicio = {
    id: 'ex001',
    nome: 'Supino Reto com Barra',
    descricao: 'Deite-se em um banco plano, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros e abaixe-a até o peito. Empurre a barra para cima até que os braços estejam totalmente estendidos.',
    grupo_muscular: 'Peitoral',
    equipamento: 'Barra e Banco',
    thumbnail_url: 'https://picsum.photos/seed/supino/400/300'
};

const agachamento: Exercicio = {
    id: 'ex002',
    nome: 'Agachamento Livre',
    descricao: 'Com a barra apoiada nos ombros, agache como se fosse sentar em uma cadeira, mantendo a coluna reta. Desça até que as coxas fiquem paralelas ao chão e retorne à posição inicial.',
    grupo_muscular: 'Pernas',
    equipamento: 'Barra',
    thumbnail_url: 'https://picsum.photos/seed/agachamento/400/300'
};

const remadaCurvada: Exercicio = {
    id: 'ex003',
    nome: 'Remada Curvada',
    descricao: 'Incline o tronco para a frente, mantendo a coluna reta. Puxe a barra em direção ao abdômen, contraindo os músculos das costas. Retorne lentamente.',
    grupo_muscular: 'Costas',
    equipamento: 'Barra',
    thumbnail_url: 'https://picsum.photos/seed/remada/400/300'
};

const elevacaoLateral: Exercicio = {
    id: 'ex004',
    nome: 'Elevação Lateral',
    descricao: 'Em pé, segure um halter em cada mão. Eleve os braços para os lados até a altura dos ombros, mantendo os cotovelos ligeiramente flexionados. Abaixe lentamente.',
    grupo_muscular: 'Ombros',
    equipamento: 'Halteres',
    thumbnail_url: 'https://picsum.photos/seed/elevacao/400/300'
};


const treinoAExercicios: TreinoExercicio[] = [
    // FIX: Changed 'exercicio' to 'exercicios' to match the TreinoExercicio type.
    { id: 'te01', exercicios: supinoReto, series: 4, repeticoes: '8-12', descanso_s: 60, order: 1 },
    // FIX: Changed 'exercicio' to 'exercicios' to match the TreinoExercicio type.
    { id: 'te02', exercicios: remadaCurvada, series: 3, repeticoes: '10', descanso_s: 60, order: 2, instrucoes: "Foco na contração das escápulas." },
    // FIX: Changed 'exercicio' to 'exercicios' to match the TreinoExercicio type.
    { id: 'te03', exercicios: elevacaoLateral, series: 4, repeticoes: '15', descanso_s: 45, order: 3 },
];

const treinoBExercicios: TreinoExercicio[] = [
    // FIX: Changed 'exercicio' to 'exercicios' to match the TreinoExercicio type.
    { id: 'te04', exercicios: agachamento, series: 4, repeticoes: '8-10', descanso_s: 90, order: 1 },
];

export const mockTreinoDoDia: Treino = {
  id: 'tr001',
  aluno_id: mockAlunoProfile.id,
  personal_id: mockPersonalProfile.id,
  nome: 'Treino A - Superior Forte',
  dia_semana: 1, // Monday
  // FIX: Changed 'exercicios' to 'treinos_exercicios' to match the Treino type.
  treinos_exercicios: treinoAExercicios,
};
