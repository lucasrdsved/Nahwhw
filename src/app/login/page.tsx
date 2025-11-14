'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClientMock';

const quickUsers = [
  { label: 'Lucas (Personal)', email: 'personal@teste.com' },
  { label: 'Matheus (Aluno)', email: 'matheus.alves@teste.com' },
  { label: 'Joana (Aluna)', email: 'joana.melo@teste.com' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('personal@teste.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signIn({ email });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),_transparent_55%)]" />
      <div className="glass-panel w-full max-w-xl px-10 py-12">
        <div className="flex flex-col gap-2 text-center">
          <span className="text-sm uppercase tracking-[0.6em] text-slate-400">EvoFit Ultimate</span>
          <h1 className="text-4xl font-semibold text-gradient">Seu estúdio digital premium</h1>
          <p className="text-slate-300">
            Escolha o perfil para entrar. Toda a experiência está pronta para migrar do mock para o Supabase real em segundos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="space-y-3">
            <label className="text-sm uppercase tracking-widest text-slate-400">E-mail de acesso</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              inputMode="email"
              className="w-full rounded-2xl border border-outline bg-surface px-5 py-4 text-lg font-medium text-white transition focus:border-neon focus:outline-none focus:ring-4 focus:ring-[rgba(96,165,250,0.25)]"
              placeholder="personal@teste.com"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {quickUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => setEmail(user.email)}
                className={`rounded-2xl border border-outline px-4 py-3 text-sm font-medium transition hover:border-neon hover:text-neon ${
                  email === user.email ? 'bg-[rgba(59,130,246,0.18)] text-neon' : 'text-slate-300'
                }`}
              >
                {user.label}
              </button>
            ))}
          </div>

          {error && <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-neon to-accent px-6 py-4 text-lg font-semibold text-white shadow-glow transition focus:outline-none focus:ring-4 focus:ring-[rgba(59,130,246,0.35)] disabled:opacity-60"
          >
            <span>{loading ? 'Validando acesso...' : 'Entrar na plataforma'}</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
          </button>
        </form>
      </div>
    </div>
  );
}
