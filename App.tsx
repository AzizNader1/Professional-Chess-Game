import React, { useState, useEffect } from 'react';
import { initializeBoard, makeMove, generateAIMove } from './models/chess';
import { GameState, GameSettings } from './types/chess';
import ChessBoard from './components/chess/ChessBoard';
import GameSettingsModal from './components/chess/GameSettingsModal';
import MoveHistory from './components/chess/MoveHistory';
import SaveLoadMenu from './components/chess/SaveLoadMenu';
import GameTimer from './components/chess/GameTimer';
import './App.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeBoard());
  const [showSettings, setShowSettings] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle AI moves if it's black's turn at game start
  useEffect(() => {
    if (gameStarted && gameState.gameMode === 'ai' && gameState.currentTurn === 'black') {
      const aiTimer = setTimeout(() => {
        const aiMove = generateAIMove(gameState, gameState.aiDifficulty || 'medium');
        if (aiMove) {
          const newGameState = makeMove(gameState, aiMove.from, aiMove.to);
          setGameState(newGameState);
        }
      }, 1000);
      
      return () => clearTimeout(aiTimer);
    }
  }, [gameStarted, gameState]);

  const handleStartGame = (settings: GameSettings) => {
    const newGameState = initializeBoard();
    newGameState.gameMode = settings.gameMode;
    newGameState.aiDifficulty = settings.aiDifficulty;
    // Ensure timeControl has all required properties
    newGameState.timeControl = {
      enabled: settings.timeControl.enabled,
      initialTime: settings.timeControl.initialTime,
      increment: settings.timeControl.increment,
      whiteTime: settings.timeControl.initialTime,
      blackTime: settings.timeControl.initialTime
    };
    
    setGameState(newGameState);
    setShowSettings(false);
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setShowSettings(true);
    setGameStarted(false);
  };

  const handleLoadGame = (loadedState: GameState) => {
    setGameState(loadedState);
    setShowSettings(false);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Professional Chess Game</h1>
          <p className="text-gray-600">Play against a friend or challenge the AI</p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <ChessBoard gameState={gameState} setGameState={setGameState} />
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleNewGame}
              >
                New Game
              </button>
              
              <SaveLoadMenu gameState={gameState} onLoadGame={handleLoadGame} />
            </div>
          </div>
          
          <div className="lg:w-1/3">
            {gameState.timeControl.enabled && (
              <GameTimer
                whiteTime={gameState.timeControl.whiteTime}
                blackTime={gameState.timeControl.blackTime}
                currentTurn={gameState.currentTurn}
                isRunning={!gameState.isCheckmate && !gameState.isStalemate}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Game Status</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>Current Turn:</span>
                  <span className="font-bold">{gameState.currentTurn === 'white' ? 'White' : 'Black'}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Game Mode:</span>
                  <span className="font-bold">{gameState.gameMode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}</span>
                </div>
                {gameState.gameMode === 'ai' && (
                  <div className="flex items-center justify-between mb-2">
                    <span>AI Difficulty:</span>
                    <span className="font-bold capitalize">{gameState.aiDifficulty}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-bold">
                    {gameState.isCheckmate ? 'Checkmate' : gameState.isStalemate ? 'Stalemate' : gameState.isCheck ? 'Check' : 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border border-black rounded-full mr-1"></div>
                  <span>Captured: {gameState.capturedPieces.black.length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-black rounded-full mr-1"></div>
                  <span>Captured: {gameState.capturedPieces.white.length}</span>
                </div>
              </div>
            </div>
            
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </div>
      </div>
      
      <GameSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onStartGame={handleStartGame}
      />
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Professional Chess Game &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
