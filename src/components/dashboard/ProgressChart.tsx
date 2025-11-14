'use client';

export interface ProgressChartDatum {
  label: string;
  valor: number;
}

interface ProgressChartProps {
  data: ProgressChartDatum[];
  titulo: string;
  legenda: string;
}

const ProgressChart = ({ data, titulo, legenda }: ProgressChartProps) => {
  if (!data.length) {
    return (
      <div className="glass-panel flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
        <p>Sem dados suficientes para gerar o gráfico.</p>
      </div>
    );
  }

  const maxValor = Math.max(...data.map((item) => item.valor));
  const minValor = Math.min(...data.map((item) => item.valor));
  const range = maxValor - minValor || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((item.valor - minValor) / range) * 100;
    return `${x},${y}`;
  });

  const gradientId = `grad-${titulo.replace(/\s+/g, '')}`;

  return (
    <div className="glass-panel flex h-full flex-col gap-4 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{legenda}</p>
        <h3 className="text-2xl font-semibold text-white">{titulo}</h3>
      </div>
      <div className="relative h-56 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(96,165,250,0.35)" />
              <stop offset="100%" stopColor="rgba(14,165,233,0.05)" />
            </linearGradient>
          </defs>
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points.join(' ')} 100,100`} fill={`url(#${gradientId})`} opacity="0.6" />
        </svg>
        <div className="absolute inset-0 grid grid-cols-4">
          {data.map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-end text-xs text-slate-400">
              <span>{item.valor}</span>
              <span className="mt-2 text-[10px] uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
