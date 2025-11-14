
import React from 'react';
import { Profile, Treino } from "@/types";
import { Header } from "./Header";
import Link from "next/link";

interface AlunoDashboardProps {
    profile: Profile;
    treinoDoDia: Treino | null;
}

const AlunoDashboard: React.FC<AlunoDashboardProps> = ({ profile, treinoDoDia }) => {
    return (
        <div>
            <Header 
                profile={profile} 
                title={`Olá, ${profile.full_name.split(' ')[0]}`} 
                subtitle={treinoDoDia ? "Pronto para o treino de hoje?" : "Você não tem treino para hoje. Bom descanso!"}
            />
            
            {treinoDoDia ? (
                <div className="bg-dark-card/80 backdrop-blur-md border border-dark-border rounded-3xl p-6 mt-8 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-blue/20 rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <p className="text-dark-text-secondary font-medium">Seu treino de hoje</p>
                        <h2 className="text-3xl font-bold text-white mt-1 mb-4">{treinoDoDia.nome}</h2>
                        <p className="text-dark-text-secondary text-sm mb-6">{treinoDoDia.treinos_exercicios.length} exercícios</p>

                        <Link 
                            href={`/treino/${treinoDoDia.id}`}
                            className="w-full block text-center bg-brand-blue hover:bg-brand-neon-blue transition-colors text-white font-bold py-4 px-6 rounded-2xl text-lg"
                        >
                            Começar Treino
                        </Link>
                    </div>
                </div>
            ) : (
                 <div className="bg-dark-card border border-dark-border rounded-3xl p-6 mt-8 text-center">
                    <h2 className="text-2xl font-bold text-white">Dia de Descanso</h2>
                    <p className="text-dark-text-secondary mt-2">Aproveite para se recuperar. Seu próximo treino será em breve.</p>
                 </div>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Progresso Semanal</h3>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex justify-around items-center h-32">
                    <p className="text-dark-text-secondary">Gráfico de progresso em breve.</p>
                </div>
            </div>
        </div>
    );
};

export default AlunoDashboard;
