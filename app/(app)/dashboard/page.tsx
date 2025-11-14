
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Profile, Aluno, Treino } from '@/types';
import PersonalDashboard from '@/components/dashboard/PersonalDashboard';
import AlunoDashboard from '@/components/dashboard/AlunoDashboard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.profile) {
        const userProfile = session.profile;
        setProfile(userProfile);

        if (userProfile.role === 'personal') {
          const { data: alunos } = await supabase.from('alunos').select('*, profiles(*)');
          setDashboardData({ alunos });
        } else if (userProfile.role === 'aluno') {
          // Fetches today's workout for the student
          const today = new Date().getDay(); // Sunday - 0, Monday - 1, etc.
          const { data: treino } = await supabase.from('treinos')
            .select('*, treinos_exercicios(*, exercicios(*))')
            .eq('dia_semana', today)
            .limit(1)
            .single();
          setDashboardData({ treino });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !profile) {
    return <div className="text-center p-10 text-dark-text-secondary">Carregando dashboard...</div>;
  }

  return (
    <div className="animate-fade-in">
      {profile.role === 'personal' && <PersonalDashboard profile={profile} alunos={dashboardData?.alunos || []} />}
      {profile.role === 'aluno' && <AlunoDashboard profile={profile} treinoDoDia={dashboardData?.treino} />}
    </div>
  );
}
