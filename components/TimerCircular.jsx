'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

const TimerCircular = ({ duration = 60, autoStart = false, label = 'Descanso', onComplete }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(autoStart);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    setRunning(autoStart);
  }, [autoStart]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      onComplete?.();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running, timeLeft, onComplete]);

  const progress = useMemo(() => {
    if (duration === 0) return 0;
    return Math.max(0, timeLeft / duration);
  }, [timeLeft, duration]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="glass-panel flex flex-col items-center gap-6 p-8 text-center">
      <span className="text-xs uppercase tracking-[0.5em] text-slate-400">{label}</span>
      <div className="relative flex items-center justify-center">
        <div className="absolute h-64 w-64 animate-pulseRing rounded-full border border-neon/30" />
        <svg className="h-64 w-64 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="transparent" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="14" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="url(#timerGradient)"
            strokeWidth="14"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center gap-2">
          <span className="text-4xl font-semibold text-white">
            {minutes}:{seconds}
          </span>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">tempo restante</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setRunning((prev) => !prev)}
          className="flex items-center gap-2 rounded-pill border border-outline/60 bg-surface px-5 py-2 text-sm font-semibold text-white transition hover:border-neon hover:text-neon"
        >
          {running ? (
            <>
              <Pause size={16} /> Pausar
            </>
          ) : (
            <>
              <Play size={16} /> Iniciar
            </>
          )}
        </button>
        <button
          onClick={() => {
            setTimeLeft(duration);
            setRunning(false);
          }}
          className="flex items-center gap-2 rounded-pill border border-outline/60 bg-surface px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-neon hover:text-neon"
        >
          <RotateCcw size={16} /> Resetar
        </button>
      </div>
    </div>
  );
};

export default TimerCircular;
