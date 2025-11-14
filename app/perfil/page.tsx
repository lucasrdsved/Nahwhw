'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClientMock';
import { storage } from '@/lib/mockUtils';
import Image from 'next/image';
import { LogOut, RefreshCcw, ShieldCheck, UserCircle } from 'lucide-react';

const PerfilPage = () => {
  const [session, setSession] = useState(null);
  const [metrics, setMetrics] = useState({ alunos: 0, treinos: 0, feedback: 0 });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [{ data: sessionData }, { data: alunosData }, { data: treinosData }, { data: feedbackData }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from('alunos').select('*'),
        supabase.from('treinos').select('*'),
        supabase.from('feedback').select('*'),
      ]);

      setSession(sessionData?.session ?? null);
      setMetrics({
        alunos: alunosData?.length ?? 0,
        treinos: treinosData?.length ?? 0,
        feedback: feedbackData?.length ?? 0,
      });
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setToast('Sessão finalizada. Volte sempre!');
    setTimeout(() => setToast(null), 2200);
  };

  const handleResetMock = () => {
    storage.remove('supabase.mock.db');
    setToast('Banco mock resetado. Atualize a página para restaurar os dados base.');
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-8">
      <Navbar />

      <section className="glass-panel grid gap-6 p-8 md:grid-cols-[0.9fr_1fr]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border border-outline/70">
            <Image
              src={session?.profile?.avatar_url ?? '/avatars/lucas-personal.svg'}
              alt={session?.profile?.full_name ?? 'Perfil'}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{session?.profile?.role ?? 'Convidado'}</p>
            <h1 className="text-3xl font-semibold text-white">{session?.profile?.full_name ?? 'Usuário desconectado'}</h1>
            <p className="text-sm text-slate-400">{session?.profile?.bio ?? 'Faça login para acessar sua experiência completa.'}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-300">
            <span className="rounded-pill border border-outline px-3 py-1">{session?.user?.email}</span>
            <span className="rounded-pill border border-outline px-3 py-1">Token: {session?.access_token?.slice(0, 10)}...</span>
          </div>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center text-sm text-slate-300">
            <div className="rounded-2xl border border-outline/40 bg-surface/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Alunos</p>
              <span className="text-3xl font-semibold text-white">{metrics.alunos}</span>
            </div>
            <div className="rounded-2xl border border-outline/40 bg-surface/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Treinos</p>
              <span className="text-3xl font-semibold text-white">{metrics.treinos}</span>
            </div>
            <div className="rounded-2xl border border-outline/40 bg-surface/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Feedbacks</p>
              <span className="text-3xl font-semibold text-white">{metrics.feedback}</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-outline bg-surface px-4 py-3 text-sm font-semibold text-white transition hover:border-neon hover:text-neon"
            >
              <LogOut size={16} /> Encerrar sessão
            </button>
            <button
              onClick={handleResetMock}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-outline bg-surface px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-neon hover:text-neon"
            >
              <RefreshCcw size={16} /> Resetar banco mock
            </button>
          </div>
          <div className="rounded-2xl border border-outline/40 bg-surface/40 p-4 text-sm text-slate-300">
            <p className="flex items-center gap-2 text-neon">
              <ShieldCheck size={18} /> Políticas RLS simuladas
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>• Personais enxergam apenas alunos vinculados ao seu perfil.</li>
              <li>• Alunos acessam somente seus próprios treinos e medidas.</li>
              <li>• Mudanças aqui refletem a mesma assinatura do supabase-js real.</li>
            </ul>
          </div>
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-2xl border border-outline/40 bg-midnight/90 px-5 py-3 text-sm text-slate-200">
          <UserCircle size={18} /> {toast}
        </div>
      ) : null}
    </main>
  );
};

export default PerfilPage;
