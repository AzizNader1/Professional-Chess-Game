import React from 'react';
import { PieceColor } from '../../types/chess';

interface GameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: PieceColor;
  isRunning: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({ whiteTime, blackTime, currentTurn, isRunning }) => {
  // Format time in mm:ss format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 mb-4">
      <div className={`flex flex-col items-center ${currentTurn === 'white' && isRunning ? 'text-blue-600' : ''}`}>
        <div className="text-lg font-bold">White</div>
        <div className={`text-2xl font-mono ${whiteTime < 30 ? 'text-red-600' : ''}`}>
          {formatTime(whiteTime)}
        </div>
      </div>
      
      <div className="text-xl font-bold mx-4">vs</div>
      
      <div className={`flex flex-col items-center ${currentTurn === 'black' && isRunning ? 'text-blue-600' : ''}`}>
        <div className="text-lg font-bold">Black</div>
        <div className={`text-2xl font-mono ${blackTime < 30 ? 'text-red-600' : ''}`}>
          {formatTime(blackTime)}
        </div>
      </div>
    </div>
  );
};

export default GameTimer;
