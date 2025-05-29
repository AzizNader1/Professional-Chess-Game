import React, { useState } from 'react';
import { GameSettings, PieceColor } from '../../types/chess';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (settings: GameSettings) => void;
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({ isOpen, onClose, onStartGame }) => {
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('pvp');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerColor, setPlayerColor] = useState<PieceColor>('white');
  const [timeControlEnabled, setTimeControlEnabled] = useState(false);
  const [initialTime, setInitialTime] = useState(10); // in minutes
  const [increment, setIncrement] = useState(5); // in seconds

  const handleStartGame = () => {
    onStartGame({
      gameMode,
      aiDifficulty: gameMode === 'ai' ? aiDifficulty : undefined,
      playerColor: gameMode === 'ai' ? playerColor : undefined,
      timeControl: {
        enabled: timeControlEnabled,
        initialTime: initialTime * 60, // convert to seconds
        increment
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Game Mode</label>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded ${gameMode === 'pvp' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setGameMode('pvp')}
            >
              Player vs Player
            </button>
            <button
              className={`px-4 py-2 rounded ${gameMode === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setGameMode('ai')}
            >
              Player vs AI
            </button>
          </div>
        </div>
        
        {gameMode === 'ai' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">AI Difficulty</label>
              <select
                className="w-full p-2 border rounded"
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Play as</label>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded ${playerColor === 'white' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setPlayerColor('white')}
                >
                  White
                </button>
                <button
                  className={`px-4 py-2 rounded ${playerColor === 'black' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setPlayerColor('black')}
                >
                  Black
                </button>
              </div>
            </div>
          </>
        )}
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="timeControl"
              checked={timeControlEnabled}
              onChange={() => setTimeControlEnabled(!timeControlEnabled)}
              className="mr-2"
            />
            <label htmlFor="timeControl" className="text-sm font-medium">Enable Time Control</label>
          </div>
        </div>
        
        {timeControlEnabled && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Initial Time (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={initialTime}
                onChange={(e) => setInitialTime(parseInt(e.target.value) || 10)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Increment (seconds)</label>
              <input
                type="number"
                min="0"
                max="60"
                value={increment}
                onChange={(e) => setIncrement(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsModal;
