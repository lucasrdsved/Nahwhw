
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import BottomNav from '@/components/ui/BottomNav';
import { Profile } from '@/types';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.profile) {
        router.replace('/login');
        return;
      }
      
      setProfile(session.profile);
      setLoading(false);
    };
    checkSession();
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <p className="text-dark-text-secondary">Carregando sua sessão...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col font-sans">
      <main className="flex-grow container mx-auto px-4 py-8 pb-24">
        {children}
      </main>
      <BottomNav role={profile.role} />
    </div>
  );
}
