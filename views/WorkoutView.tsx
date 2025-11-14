
import React, { useState, useEffect } from 'react';
import { Treino } from '../types';
import CircularProgress from '../components/CircularProgress';

interface WorkoutViewProps {
  treino: Treino;
  onFinish: () => void;
}

type WorkoutState = 'exercicio' | 'descanso';

const WorkoutView: React.FC<WorkoutViewProps> = ({ treino, onFinish }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('exercicio');
  const [isPlaying, setIsPlaying] = useState(true);

  const currentExercise = treino.exercicios[currentExerciseIndex];

  const handleNext = () => {
    if (workoutState === 'exercicio') {
      setWorkoutState('descanso');
    } else {
      if (currentSet < currentExercise.series) {
        setCurrentSet(prev => prev + 1);
        setWorkoutState('exercicio');
      } else {
        // Move to next exercise
        if (currentExerciseIndex < treino.exercicios.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
          setWorkoutState('exercicio');
        } else {
          // Workout finished
          onFinish();
        }
      }
    }
  };
  
  const timerDuration = workoutState === 'descanso' ? currentExercise.descanso_s : 1; // Placeholder for exercise timer

  const renderContent = () => {
    if (workoutState === 'descanso') {
      return (
        <div className="text-center flex flex-col items-center justify-center h-full">
            <p className="text-xl text-gray-300 mb-4">Descanso</p>
            <CircularProgress 
                duration={currentExercise.descanso_s}
                size={250}
                strokeWidth={15}
                onComplete={handleNext}
                isPlaying={isPlaying}
            />
            <p className="mt-6 text-gray-400">Próximo: {currentSet < currentExercise.series ? `${currentSet+1}ª série de ${currentExercise.exercicio.nome}` : treino.exercicios[currentExerciseIndex+1]?.exercicio.nome || "Finalizar"}</p>
        </div>
      );
    }

    return (
        <div>
            <div className="mb-4">
                <span className="bg-brand-blue/20 text-brand-neon-blue text-sm font-bold px-3 py-1 rounded-full">{currentExercise.exercicio.grupo_muscular}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{currentExercise.exercicio.nome}</h1>
            <p className="text-lg text-gray-300 mb-4">{currentSet} / {currentExercise.series} séries</p>
            
            <div className="aspect-video bg-dark-card rounded-2xl mb-6 flex items-center justify-center">
                 <img src={currentExercise.exercicio.thumbnail_url} alt={currentExercise.exercicio.nome} className="w-full h-full object-cover rounded-2xl" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-dark-card p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Repetições</p>
                    <p className="text-2xl font-bold">{currentExercise.repeticoes}</p>
                </div>
                <div className="bg-dark-card p-4 rounded-xl">
                    <p className="text-sm text-gray-400">Descanso</p>
                    <p className="text-2xl font-bold">{currentExercise.descanso_s}s</p>
                </div>
            </div>
            {currentExercise.instrucoes && (
                <div className="mt-4 bg-dark-card p-4 rounded-xl">
                    <p className="text-sm text-gray-300">{currentExercise.instrucoes}</p>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 pt-12 animate-fade-in">
        <div className="flex-grow">
            {renderContent()}
        </div>
        <div className="flex-shrink-0 pt-4 flex items-center gap-4">
             <button onClick={handleNext} className="w-full bg-brand-green hover:bg-brand-neon-green transition-colors text-black font-bold py-5 px-6 rounded-2xl text-lg">
                {workoutState === 'exercicio' ? 'Feito! Descansar' : 'Pular Descanso'}
            </button>
             <button onClick={onFinish} className="flex-shrink-0 bg-dark-card text-white font-bold py-5 px-6 rounded-2xl text-lg">
                Sair
            </button>
        </div>
    </div>
  );
};

export default WorkoutView;
