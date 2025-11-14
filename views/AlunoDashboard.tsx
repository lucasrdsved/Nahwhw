import React from 'react';
import { mockAlunoProfile, mockTreinoDoDia } from '../services/mockData';
import Header from '../components/Header';

interface AlunoDashboardProps {
  onStartWorkout: () => void;
}

const AlunoDashboard: React.FC<AlunoDashboardProps> = ({ onStartWorkout }) => {
    return (
        <div className="animate-fade-in">
            <Header profile={mockAlunoProfile} title={`Olá, ${mockAlunoProfile.full_name.split(' ')[0]}`} subtitle="Pronto para o treino de hoje?" />
            
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 mt-8 relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-blue/20 rounded-full blur-3xl"></div>
                 <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <p className="text-gray-300 font-medium">Seu treino de hoje</p>
                    <h2 className="text-3xl font-bold text-white mt-1 mb-4">{mockTreinoDoDia.nome}</h2>
                    {/* FIX: Changed 'exercicios' to 'treinos_exercicios' to match the Treino type. */}
                    <p className="text-gray-400 text-sm mb-6">{mockTreinoDoDia.treinos_exercicios.length} exercícios</p>

                    <button 
                        onClick={onStartWorkout}
                        className="w-full bg-brand-blue hover:bg-brand-neon-blue transition-colors text-white font-bold py-4 px-6 rounded-2xl text-lg"
                    >
                        Começar Treino
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Progresso Semanal</h3>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex justify-around items-center h-32">
                    <p className="text-gray-500">Gráficos de progresso aqui.</p>
                </div>
            </div>
        </div>
    );
};

export default AlunoDashboard;
