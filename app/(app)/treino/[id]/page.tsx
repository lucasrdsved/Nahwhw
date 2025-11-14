
'use client';
import { useState, useEffect } from 'react';
import { Treino } from '@/types';
import CircularProgress from '@/components/ui/CircularProgress';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

type WorkoutState = 'exercicio' | 'descanso';

export default function WorkoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('exercicio');
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const fetchTreino = async () => {
      const { data } = await supabase
        .from('treinos')
        .select('*, treinos_exercicios(*, exercicios(*))')
        .eq('id', params.id)
        .single();
      
      if (data) {
        data.treinos_exercicios.sort((a, b) => a.order - b.order);
        setTreino(data);
      }
      setLoading(false);
    };
    fetchTreino();
  }, [params.id]);

  useEffect(() => {
    // Prevent scrolling when the workout view is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);


  if (loading || !treino) {
    return <div className="fixed inset-0 bg-dark-bg z-50 flex items-center justify-center">Carregando treino...</div>;
  }

  const currentTreinoExercicio = treino.treinos_exercicios[currentExerciseIndex];
  const currentExercise = currentTreinoExercicio.exercicios;

  const handleFinish = () => {
      router.back();
  };

  const handleNext = () => {
    if (workoutState === 'exercicio') {
      setWorkoutState('descanso');
    } else {
      if (currentSet < currentTreinoExercicio.series) {
        setCurrentSet(prev => prev + 1);
        setWorkoutState('exercicio');
      } else {
        if (currentExerciseIndex < treino.treinos_exercicios.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
          setWorkoutState('exercicio');
        } else {
          handleFinish();
        }
      }
    }
  };

  const renderContent = () => {
    if (workoutState === 'descanso') {
      const proximoExercicio = currentSet < currentTreinoExercicio.series 
          ? `${currentSet + 1}ª Série: ${currentExercise.nome}`
          : treino.treinos_exercicios[currentExerciseIndex + 1]?.exercicios.nome || "Finalizar Treino";

      return (
        <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
            <p className="text-xl text-dark-text-secondary mb-4 font-medium">Descanso</p>
            <CircularProgress 
                duration={currentTreinoExercicio.descanso_s}
                size={250}
                strokeWidth={15}
                onComplete={handleNext}
                isPlaying={isPlaying}
            />
            <div className="mt-8 text-center">
              <p className="text-sm text-dark-text-secondary">A SEGUIR</p>
              <p className="text-lg font-semibold text-white">{proximoExercicio}</p>
            </div>
        </div>
      );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <span className="bg-brand-blue/20 text-brand-neon-blue text-sm font-bold px-3 py-1 rounded-full">{currentExercise.grupo_muscular}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-balance">{currentExercise.nome}</h1>
            <p className="text-lg text-dark-text-secondary mb-4">{currentSet} / {currentTreinoExercicio.series} séries</p>
            
            <div className="aspect-video bg-dark-card rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-lg">
                 <img src={currentExercise.thumbnail_url} alt={currentExercise.nome} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-dark-card p-4 rounded-xl">
                    <p className="text-sm text-dark-text-secondary">Repetições</p>
                    <p className="text-2xl font-bold">{currentTreinoExercicio.repeticoes}</p>
                </div>
                <div className="bg-dark-card p-4 rounded-xl">
                    <p className="text-sm text-dark-text-secondary">Descanso</p>
                    <p className="text-2xl font-bold">{currentTreinoExercicio.descanso_s}s</p>
                </div>
            </div>
            {currentTreinoExercicio.instrucoes && (
                <div className="mt-4 bg-dark-card p-4 rounded-xl">
                    <p className="text-sm text-gray-300">{currentTreinoExercicio.instrucoes}</p>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col p-4 animate-fade-in">
        <div className="flex-shrink-0 pt-8 pb-4 flex justify-end">
             <button onClick={handleFinish} className="flex-shrink-0 bg-dark-card p-2 rounded-full text-white">
                <X size={24} />
            </button>
        </div>
        <div className="flex-grow flex flex-col justify-center">
            {renderContent()}
        </div>
        <div className="flex-shrink-0 pt-4 flex items-center">
             <button onClick={handleNext} className="w-full bg-brand-green hover:bg-brand-neon-green transition-colors text-black font-bold py-5 px-6 rounded-2xl text-lg">
                {workoutState === 'exercicio' ? 'Concluir Série' : 'Pular Descanso'}
            </button>
        </div>
    </div>
  );
};
