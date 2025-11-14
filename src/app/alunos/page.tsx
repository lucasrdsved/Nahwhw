'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, PlusCircle } from 'lucide-react';

import AlunoCard from '@/components/dashboard/AlunoCard';
import Navbar from '@/components/navigation/Navbar';
import { supabase } from '@/lib/supabaseClientMock';
import { generateId } from '@/lib/mockUtils';
import type { Aluno, Session } from '@/types';

const objetivos = ['Hipertrofia', 'Condicionamento', 'Performance', 'Reabilitação'];

interface FormValues {
  nome: string;
  email: string;
  objetivo: string;
  idade: string;
  peso: string;
  altura: string;
}

/**
 * Management screen for personals to review and onboard students using the mock Supabase backend.
 *
 * @returns The alunos page with roster overview and creation form.
 */
const AlunosPage = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    nome: '',
    email: '',
    objetivo: objetivos[0],
    idade: '',
    peso: '',
    altura: '',
  });

  /**
   * Fetches all students visible to the current session, including related profile information.
   *
   * @returns A promise that resolves once local state has been updated with the retrieved students.
   */
  const fetchAlunos = async () => {
    const { data } = await supabase.from('alunos').select('*, profiles(*)');
    setAlunos((data as Aluno[] | null) ?? []);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      await fetchAlunos();
    };
    void bootstrap();
  }, []);

  /**
   * Handles student creation by inserting the related user, profile and aluno records in the mock database.
   *
   * @param event - Browser form submission event.
   * @returns A promise that resolves once the student has been persisted and UI state refreshed.
   */
  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.profile?.id) return;
    setSaving(true);
    setSuccessMessage(null);

    const userId = generateId('u');
    const profileId = generateId('p');
    const alunoId = generateId('a');

    await supabase.from('users').insert({ id: userId, email: formValues.email });
    await supabase.from('profiles').insert({
      id: profileId,
      user_id: userId,
      role: 'aluno',
      full_name: formValues.nome,
      avatar_url: '/avatars/default.svg',
    });

    await supabase.from('alunos').insert({
      id: alunoId,
      personal_id: session.profile.id,
      profile_id: profileId,
      objetivo: formValues.objetivo,
      idade: Number(formValues.idade) || null,
      peso_atual_kg: Number(formValues.peso) || null,
      altura_m: Number(formValues.altura) || null,
      progresso_meta: { semana: 0, meta: 100 },
      marcadores: ['Onboarding'],
    });

    setFormValues({ nome: '', email: '', objetivo: objetivos[0], idade: '', peso: '', altura: '' });
    setSuccessMessage('Aluno criado com sucesso! Dados sincronizados com o mock Supabase.');
    await fetchAlunos();
    setSaving(false);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8">
      <Navbar />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Alunos ativos</h2>
          <p className="text-sm text-slate-400">
            Visualize seus alunos com todas as informações sincronizadas com o backend mock. Basta conectar o Supabase real
            para manter a mesma assinatura de dados.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {alunos.map((aluno) => (
              <AlunoCard key={aluno.id} aluno={aluno} />
            ))}
          </div>
        </div>

        <div className="glass-panel h-fit space-y-6 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(59,130,246,0.18)] p-3 text-neon">
              <PlusCircle />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Novo aluno</p>
              <h3 className="text-2xl font-semibold text-white">Cadastro instantâneo</h3>
            </div>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4">
              <input
                value={formValues.nome}
                onChange={(event) => setFormValues((prev) => ({ ...prev, nome: event.target.value }))}
                placeholder="Nome completo"
                className="rounded-2xl border border-outline bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-neon focus:outline-none"
                required
              />
              <input
                value={formValues.email}
                onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
                type="email"
                placeholder="Email para login"
                className="rounded-2xl border border-outline bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-neon focus:outline-none"
                required
              />
              <select
                value={formValues.objetivo}
                onChange={(event) => setFormValues((prev) => ({ ...prev, objetivo: event.target.value }))}
                className="rounded-2xl border border-outline bg-surface px-4 py-3 text-sm text-white focus:border-neon focus:outline-none"
              >
                {objetivos.map((objetivo) => (
                  <option key={objetivo} value={objetivo}>
                    {objetivo}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-3">
                <input
                  value={formValues.idade}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, idade: event.target.value }))}
                  type="number"
                  placeholder="Idade"
                  className="rounded-2xl border border-outline bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-neon focus:outline-none"
                />
                <input
                  value={formValues.peso}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, peso: event.target.value }))}
                  type="number"
                  step="0.1"
                  placeholder="Peso (kg)"
                  className="rounded-2xl border border-outline bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-neon focus:outline-none"
                />
                <input
                  value={formValues.altura}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, altura: event.target.value }))}
                  type="number"
                  step="0.01"
                  placeholder="Altura (m)"
                  className="rounded-2xl border border-outline bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-neon focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-gradient-to-r from-neon to-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition disabled:opacity-60"
            >
              {saving ? 'Sincronizando...' : 'Criar aluno'}
            </button>
          </form>
          {successMessage ? (
            <div className="flex items-center gap-2 rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              <CheckCircle2 size={18} /> {successMessage}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default AlunosPage;
