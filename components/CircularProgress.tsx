
import React, { useState, useEffect } from 'react';

interface CircularProgressProps {
  duration: number;
  size: number;
  strokeWidth: number;
  onComplete: () => void;
  isPlaying: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ duration, size, strokeWidth, onComplete, isPlaying }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((duration - timeLeft) / duration) * circumference;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete, isPlaying]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: progress,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s linear',
          }}
        />
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5EFF8A" />
                <stop offset="100%" stopColor="#34C759" />
            </linearGradient>
        </defs>
      </svg>
      <span className="text-5xl font-mono font-bold text-white tracking-tighter">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default CircularProgress;
