'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Dumbbell, Home, User, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClientMock';
import type { UserRole } from '@/types';

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/alunos', label: 'Alunos', icon: Dumbbell },
  { href: '/treino', label: 'Treino', icon: BarChart3 },
  { href: '/perfil', label: 'Perfil', icon: User },
];

const Navbar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole>('personal');

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionRole = data?.session?.profile?.role;

      if (sessionRole === 'personal' || sessionRole === 'aluno') {
        setRole(sessionRole);
      }
    };

    void loadSession();
  }, []);

  return (
    <nav className="glass-panel flex w-full items-center justify-between gap-4 px-5 py-4">
      <div>
        <span className="text-xs uppercase tracking-[0.6em] text-slate-400">EvoFit Ultimate</span>
        <h2 className="font-display text-2xl font-semibold text-gradient">{role === 'personal' ? 'Painel do Personal' : 'Painel do Aluno'}</h2>
      </div>
      <ul className="flex items-center gap-2 rounded-pill bg-surface/60 p-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-[rgba(59,130,246,0.25)] text-neon shadow-glow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
