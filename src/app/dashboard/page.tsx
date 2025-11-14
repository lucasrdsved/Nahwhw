'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, CalendarRange, Sparkles } from 'lucide-react';

import AlunoCard from '@/components/dashboard/AlunoCard';
import ExerciseCard from '@/components/dashboard/ExerciseCard';
import ProgressChart, { type ProgressChartDatum } from '@/components/dashboard/ProgressChart';
import Navbar from '@/components/navigation/Navbar';
import { supabase } from '@/lib/supabaseClientMock';
import type { Aluno, Feedback, Progresso, Session, Treino } from '@/types';
type TreinoCompleto = Treino & { treinos_exercicios?: Treino['treinos_exercicios'] };

const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [treinos, setTreinos] = useState<TreinoCompleto[]>([]);
  const [progresso, setProgresso] = useState<Progresso[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const bootstrap = async () => {
      const [sessionResult, alunosResult, treinosResult, progressoResult, feedbackResult] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from('alunos').select('*, profiles(*)'),
        supabase.from('treinos').select('*, treinos_exercicios(*, exercicios(*))'),
        supabase.from('progresso').select('*'),
        supabase.from('feedback').select('*'),
      ]);

      setSession(sessionResult.data?.session ?? null);
      setAlunos((alunosResult.data as Aluno[] | null) ?? []);
      setTreinos((treinosResult.data as TreinoCompleto[] | null) ?? []);
      setProgresso((progressoResult.data as Progresso[] | null) ?? []);
      setFeedback((feedbackResult.data as Feedback[] | null) ?? []);
      setLoading(false);
    };

    void bootstrap();
  }, []);

  const treinoDoDia = useMemo<TreinoCompleto | null>(() => {
    if (!treinos.length) return null;
    const hoje = new Date().getDay();
    return treinos.find((treino) => treino.dia_semana === hoje) ?? treinos[0];
  }, [treinos]);

  const graficoData = useMemo<ProgressChartDatum[]>(() => {
    return progresso
      .slice()
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .map((item) => ({
        label: new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        valor: Math.round(item.metricas?.carga_total_kg ?? item.metricas?.tempo_total_s ?? 0),
      }))
      .slice(-4);
  }, [progresso]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-panel px-8 py-6 text-sm text-slate-300">Carregando painel inteligente...</div>
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8">
      <Navbar />

      <section className="grid gap-6 lg:grid-cols-3">
        {alunos.map((aluno) => (
          <AlunoCard key={aluno.id} aluno={aluno} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressChart data={graficoData} titulo="Performance recente" legenda="Carga total x sessões" />
        </div>
        <div className="glass-panel flex h-full flex-col gap-6 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Feedbacks</p>
            <h3 className="text-2xl font-semibold text-white">Insights dos alunos</h3>
          </div>
          <ul className="flex flex-col gap-4 text-sm text-slate-300">
            {feedback.slice(0, 3).map((item) => (
              <li key={item.id} className="rounded-2xl border border-outline/40 bg-surface/30 p-4">
                <p className="font-medium text-neon">{item.mensagem}</p>
                <span className="mt-2 block text-xs uppercase tracking-widest text-slate-500">
                  {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {treinoDoDia ? (
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Treino do dia</p>
                <h3 className="text-3xl font-semibold text-white">{treinoDoDia.nome}</h3>
                <p className="text-sm text-slate-400">{treinoDoDia.descricao}</p>
              </div>
              <div className="glass-panel flex items-center gap-3 px-5 py-3 text-sm uppercase tracking-widest text-neon">
                <CalendarRange size={18} />
                {session?.profile?.role === 'personal' ? 'Personal Mode' : 'Aluno Mode'}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {treinoDoDia.treinos_exercicios?.map((prescription) => (
                <ExerciseCard
                  key={prescription.id}
                  exercicio={prescription.exercicios}
                  prescription={prescription}
                />
              ))}
            </div>
          </div>
          <div className="glass-panel flex flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(59,130,246,0.18)] p-3 text-neon">
                <Activity />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Objetivo</p>
                <h4 className="text-xl font-semibold text-white">{treinoDoDia.objetivo}</h4>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Garanta execuções controladas, monitorando cadência, tempo sob tensão e recuperação ativa. Ajuste as cargas
              diretamente pelos controles de treino para manter a progressão planejada.
            </p>
            <div className="rounded-2xl border border-outline/40 bg-surface/40 p-4 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-500">Próximos passos</span>
              <p className="mt-2 flex items-center gap-2 text-neon">
                <Sparkles size={18} /> Atualize as cargas dos exercícios concluídos para liberar o relatório semanal automático.
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default DashboardPage;
