
import React from 'react';
import { mockPersonalProfile, mockAlunos } from '../services/mockData';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import UsersIcon from '../components/icons/UsersIcon';
import DumbbellIcon from '../components/icons/DumbbellIcon';

const PersonalDashboard: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Header profile={mockPersonalProfile} title="Dashboard" subtitle="Bem-vindo de volta, Alex!" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <DashboardCard title="Alunos Ativos" value={mockAlunos.length.toString()} icon={<UsersIcon />} colorClass="bg-brand-blue" />
        <DashboardCard title="Treinos Hoje" value="2" icon={<DumbbellIcon />} colorClass="bg-brand-green" />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Meus Alunos</h2>
        <div className="space-y-3">
          {mockAlunos.map(aluno => (
            <div key={aluno.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-center space-x-4">
              <img src={aluno.avatar_url} alt={aluno.full_name} className="w-12 h-12 rounded-full" />
              <div className="flex-grow">
                <p className="font-semibold">{aluno.full_name}</p>
                <p className="text-sm text-gray-400 capitalize">{aluno.objetivo}</p>
              </div>
              <button className="text-brand-neon-blue text-sm font-semibold">Ver Treino</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;
