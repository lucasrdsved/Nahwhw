
import React from 'react';
import { Profile, Aluno } from "@/types"
import { Header } from "./Header"
import DashboardCard from "./DashboardCard";
import { Users, Dumbbell } from 'lucide-react';

interface PersonalDashboardProps {
    profile: Profile;
    alunos: Aluno[];
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ profile, alunos }) => {
  return (
    <div>
      <Header profile={profile} title="Dashboard" subtitle={`Bem-vindo, ${profile.full_name.split(' ')[0]}!`} />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <DashboardCard title="Alunos Ativos" value={alunos.length.toString()} icon={<Users />} colorClass="bg-brand-blue" />
        <DashboardCard title="Treinos Hoje" value="2" icon={<Dumbbell />} colorClass="bg-brand-green" />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Meus Alunos</h2>
        <div className="space-y-3">
          {alunos.map(aluno => (
            <div key={aluno.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-center space-x-4">
              <img src={aluno.profiles.avatar_url} alt={aluno.profiles.full_name} className="w-12 h-12 rounded-full" />
              <div className="flex-grow">
                <p className="font-semibold">{aluno.profiles.full_name}</p>
                <p className="text-sm text-dark-text-secondary capitalize">{aluno.objetivo}</p>
              </div>
              <button className="text-brand-neon-blue text-sm font-semibold">Ver Treino</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PersonalDashboard;
