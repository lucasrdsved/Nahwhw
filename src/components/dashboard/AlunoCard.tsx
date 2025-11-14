'use client';

import Image from 'next/image';
import { Trophy, TrendingUp } from 'lucide-react';

import type { Aluno } from '@/types';

interface AlunoCardProps {
  aluno: Aluno;
}

const AlunoCard = ({ aluno }: AlunoCardProps) => {
  const progresso = aluno.progresso_meta ?? { semana: 0, meta: 100 };
  const percentual = Math.min(100, Math.round((progresso.semana / progresso.meta) * 100));
  const objetivo = aluno.objetivo ?? 'Performance';
  const avatarUrl = aluno.profiles?.avatar_url ?? '/avatars/default.svg';
  const nome = aluno.profiles?.full_name ?? 'Aluno';

  return (
    <div className="glass-panel flex flex-col justify-between overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-outline/60">
          <Image src={avatarUrl} alt={nome} fill sizes="(min-width: 1024px) 128px, 96px" className="object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Aluno</p>
          <h3 className="text-2xl font-semibold text-white">{nome}</h3>
          <p className="text-sm text-slate-400">Objetivo: {objetivo}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Meta semanal</span>
          <span>
            {progresso.semana} / {progresso.meta}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-pill bg-surface">
          <div className="h-full rounded-pill bg-gradient-to-r from-neon to-accent" style={{ width: `${percentual}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <TrendingUp size={14} /> Performance semanal
          </span>
          <span className="flex items-center gap-1 text-neon">
            <Trophy size={14} /> {percentual}%
          </span>
        </div>
      </div>

      {aluno.marcadores?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {aluno.marcadores.map((tag) => (
            <span key={tag} className="rounded-pill border border-outline px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AlunoCard;
