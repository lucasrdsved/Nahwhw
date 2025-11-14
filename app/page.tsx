'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
      <div className="glass-panel px-8 py-6 text-center">
        <p className="text-sm tracking-wide text-slate-400">Carregando experiência EvoFit...</p>
      </div>
    </div>
  );
}
