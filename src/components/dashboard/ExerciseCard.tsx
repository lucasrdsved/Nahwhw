'use client';

import Image from 'next/image';
import { Clock, Flame, Repeat } from 'lucide-react';

import type { Exercicio, TreinoExercicio } from '@/types';

interface ExerciseCardProps {
  exercicio: Exercicio | null | undefined;
  prescription?: TreinoExercicio | null;
}

const ExerciseCard = ({ exercicio, prescription }: ExerciseCardProps) => {
  if (!exercicio) return null;

  const imageSrc = exercicio.imagem ?? '/exercicios/placeholder.svg';
  const intensidade = prescription?.intensidade ?? 'Zona 3';

  return (
    <div className="glass-panel flex flex-col overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <Image src={imageSrc} alt={exercicio.nome} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-300">
          <span>{exercicio.grupo}</span>
          <span>{exercicio.equipamento}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 py-5">
        <div>
          <h3 className="text-xl font-semibold text-white">{exercicio.nome}</h3>
          {exercicio.foco ? <p className="text-sm text-slate-400">{exercicio.foco}</p> : null}
        </div>
        {prescription ? (
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-medium text-slate-300">
            <div className="rounded-2xl border border-outline/60 bg-surface/40 px-3 py-2">
              <Repeat size={16} className="mx-auto mb-1 text-neon" />
              <span>{prescription.series} séries</span>
              <span className="block text-[11px] text-slate-500">x {prescription.repeticoes}</span>
            </div>
            <div className="rounded-2xl border border-outline/60 bg-surface/40 px-3 py-2">
              <Clock size={16} className="mx-auto mb-1 text-neon" />
              <span>{prescription.descanso_s}s</span>
              <span className="block text-[11px] text-slate-500">Descanso</span>
            </div>
            <div className="rounded-2xl border border-outline/60 bg-surface/40 px-3 py-2">
              <Flame size={16} className="mx-auto mb-1 text-neon" />
              <span>{intensidade}</span>
              <span className="block text-[11px] text-slate-500">Intensidade</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ExerciseCard;
