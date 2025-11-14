
'use client'

import React from 'react';
import { Profile } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  profile: Profile;
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ profile, title, subtitle }) => {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return (
        <header className="flex items-start justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                <p className="text-dark-text-secondary">{subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-12 h-12 rounded-full border-2 border-dark-border"
                />
                <button onClick={handleSignOut} className="text-dark-text-secondary hover:text-white transition-colors" aria-label="Sair">
                    <LogOut size={24} />
                </button>
            </div>
        </header>
    );
};
