'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

import ExerciseCard from '@/components/dashboard/ExerciseCard';
import Navbar from '@/components/navigation/Navbar';
import RestTimer from '@/components/training/RestTimer';
import { supabase } from '@/lib/supabaseClientMock';
import type { Aluno, Progresso, Session, Treino, TreinoExercicio } from '@/types';

type TreinoCompleto = Treino & { treinos_exercicios?: TreinoExercicio[] };

/**
 * Interactive training workspace allowing personals and students to review and update prescriptions.
 *
 * @returns The treino page layout containing timers, exercise lists and history panels.
 */
const TreinoPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [treinos, setTreinos] = useState<TreinoCompleto[]>([]);
  const [progresso, setProgresso] = useState<Progresso[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<string | null>(null);
  const [seriesConcluidas, setSeriesConcluidas] = useState<Record<string, number>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const [sessionResult, alunosResult, treinosResult, progressoResult] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from('alunos').select('*, profiles(*)'),
        supabase.from('treinos').select('*, treinos_exercicios(*, exercicios(*))'),
        supabase.from('progresso').select('*'),
      ]);

      setSession(sessionResult.data?.session ?? null);
      const alunosData = (alunosResult.data as Aluno[] | null) ?? [];
      setAlunos(alunosData);
      const treinosData = (treinosResult.data as TreinoCompleto[] | null) ?? [];
      setTreinos(treinosData);
      setProgresso((progressoResult.data as Progresso[] | null) ?? []);

      if (sessionResult.data?.session?.profile?.role === 'aluno') {
        const aluno = alunosData.find((item) => item.profile_id === sessionResult.data.session.profile.id);
        setSelectedAluno(aluno?.id ?? null);
      } else {
        setSelectedAluno(alunosData[0]?.id ?? null);
      }
    };

    void bootstrap();
  }, []);

  const treinosFiltrados = useMemo(() => {
    return treinos.filter((treino) => treino.aluno_id === selectedAluno);
  }, [treinos, selectedAluno]);

  const treinoAtual = treinosFiltrados[0] ?? null;
  const exercicioPrincipal = treinoAtual?.treinos_exercicios?.[0] ?? null;

  const historicoAluno = useMemo(() => {
    return progresso
      .filter((item) => item.aluno_id === selectedAluno)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
  }, [progresso, selectedAluno]);

  /**
   * Updates a prescription field both in the mock backend and local state to keep the UI responsive.
   *
   * @typeParam K - Key of `TreinoExercicio` being updated.
   * @param id - Identifier of the prescription being modified.
   * @param campo - Field name to update.
   * @param valor - New value written to the field.
   * @returns A promise that resolves when the mock API and state are synchronised.
   */
  const handleUpdatePrescricao = async <K extends keyof TreinoExercicio>(id: string, campo: K, valor: TreinoExercicio[K]) => {
    setUpdatingId(id);
    const payload = { [campo]: valor } as Partial<TreinoExercicio>;
    await supabase.from('treinos_exercicios').update(payload).eq('id', id);
    setTreinos((prev) =>
      prev.map((treino) => ({
        ...treino,
        treinos_exercicios: treino.treinos_exercicios?.map((item) =>
          item.id === id ? { ...item, ...payload } : item
        ),
      }))
    );
    setToast('Prescrição atualizada com sucesso.');
    setUpdatingId(null);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8">
      <Navbar />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Selecione o aluno</p>
            <h2 className="text-3xl font-semibold text-white">Central de treinos inteligentes</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {alunos.map((aluno) => (
              <button
                key={aluno.id}
                onClick={() => setSelectedAluno(aluno.id)}
                className={`rounded-pill border px-4 py-2 text-sm font-medium transition ${
                  selectedAluno === aluno.id
                    ? 'border-neon bg-[rgba(59,130,246,0.2)] text-neon shadow-glow'
                    : 'border-outline text-slate-300 hover:text-white'
                }`}
              >
                {aluno.profiles?.full_name}
              </button>
            ))}
          </div>
        </div>
        {treinoAtual ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <div className="glass-panel flex flex-col gap-3 p-6">
                <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Treino selecionado</span>
                <h3 className="text-2xl font-semibold text-white">{treinoAtual.nome}</h3>
                <p className="text-sm text-slate-400">{treinoAtual.descricao}</p>
              </div>
              <div className="grid gap-4">
                {treinoAtual.treinos_exercicios.map((prescricao) => (
                  <div key={prescricao.id} className="glass-panel grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr]">
                    <ExerciseCard exercicio={prescricao.exercicios} prescription={prescricao} />
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
                        <label className="space-y-2">
                          <span>Séries</span>
                          <input
                            defaultValue={prescricao.series}
                            type="number"
                            min={1}
                            className="w-full rounded-2xl border border-outline bg-surface px-3 py-2 text-center text-white focus:border-neon focus:outline-none"
                            onBlur={(event) => handleUpdatePrescricao(prescricao.id, 'series', Number(event.target.value))}
                          />
                        </label>
                        <label className="space-y-2">
                          <span>Reps</span>
                          <input
                            defaultValue={prescricao.repeticoes}
                            className="w-full rounded-2xl border border-outline bg-surface px-3 py-2 text-center text-white focus:border-neon focus:outline-none"
                            onBlur={(event) => handleUpdatePrescricao(prescricao.id, 'repeticoes', event.target.value)}
                          />
                        </label>
                        <label className="space-y-2">
                          <span>Descanso (s)</span>
                          <input
                            defaultValue={prescricao.descanso_s}
                            type="number"
                            min={15}
                            className="w-full rounded-2xl border border-outline bg-surface px-3 py-2 text-center text-white focus:border-neon focus:outline-none"
                            onBlur={(event) => handleUpdatePrescricao(prescricao.id, 'descanso_s', Number(event.target.value))}
                          />
                        </label>
                      </div>
                      <button
                        onClick={() =>
                          setSeriesConcluidas((prev) => ({
                            ...prev,
                            [prescricao.id]: (prev[prescricao.id] ?? 0) + 1,
                          }))
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl border border-success/40 bg-success/10 px-4 py-2 text-sm font-semibold text-success"
                      >
                        <CheckCircle size={16} /> Marcar série concluída ({seriesConcluidas[prescricao.id] ?? 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {exercicioPrincipal ? (
                <RestTimer
                  key={exercicioPrincipal.id}
                  duration={Number(exercicioPrincipal.descanso_s) || 60}
                  label={`Descanso - ${exercicioPrincipal.exercicios?.nome}`}
                />
              ) : null}
              <div className="glass-panel p-6">
                <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Histórico recente</span>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {historicoAluno.map((item) => (
                    <li key={item.id} className="flex items-center justify-between rounded-2xl border border-outline/40 bg-surface/40 px-4 py-3">
                      <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                      <span className="text-neon">
                        {item.metricas?.carga_total_kg ? `${item.metricas.carga_total_kg} kg` : `${item.metricas?.tempo_total_s ?? 0} s`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 text-center text-slate-400">
            Nenhum treino encontrado para este aluno.
          </div>
        )}
      </section>

      {toast ? (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-2xl border border-neon/40 bg-midnight/90 px-5 py-3 text-sm text-neon shadow-glow">
          <CheckCircle size={18} /> {toast}
        </div>
      ) : null}

      {updatingId ? (
        <div className="fixed inset-0 flex items-end justify-center bg-black/20 p-6 text-sm text-slate-300">
          <div className="glass-panel flex items-center gap-3 px-4 py-2">
            <Loader2 className="animate-spin" size={18} /> Atualizando prescrição...
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default TreinoPage;
