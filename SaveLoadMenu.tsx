import React, { useState } from 'react';
import { GameState } from '../../types/chess';
import { saveGame, loadGame, getSavedGames } from '../../models/chess';

interface SaveLoadMenuProps {
  gameState: GameState;
  onLoadGame: (loadedState: GameState) => void;
}

const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({ gameState, onLoadGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'save' | 'load'>('save');
  const [saveName, setSaveName] = useState('');
  const [savedGames, setSavedGames] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleOpen = (selectedMode: 'save' | 'load') => {
    setMode(selectedMode);
    setMessage('');
    
    if (selectedMode === 'load') {
      // Get list of saved games
      const games = getSavedGames();
      setSavedGames(games);
    }
    
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      setMessage('Please enter a name for your save');
      return;
    }
    
    try {
      saveGame(gameState, saveName);
      setMessage(`Game saved as "${saveName}"`);
      setSaveName('');
      
      // Update saved games list
      setSavedGames(getSavedGames());
    } catch (error) {
      setMessage('Error saving game');
      console.error('Save error:', error);
    }
  };

  const handleLoad = (name: string) => {
    try {
      const loadedState = loadGame(name);
      
      if (loadedState) {
        onLoadGame(loadedState);
        setMessage(`Game "${name}" loaded successfully`);
        setIsOpen(false);
      } else {
        setMessage(`Could not load game "${name}"`);
      }
    } catch (error) {
      setMessage('Error loading game');
      console.error('Load error:', error);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleOpen('save')}
        >
          Save Game
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handleOpen('load')}
        >
          Load Game
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-2xl font-bold mb-4">
              {mode === 'save' ? 'Save Game' : 'Load Game'}
            </h2>
            
            {message && (
              <div className={`p-2 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {message}
              </div>
            )}
            
            {mode === 'save' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Save Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Enter a name for your save"
                />
                
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {savedGames.length === 0 ? (
                  <p className="text-gray-500 mb-4">No saved games found</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto mb-4">
                    <ul className="divide-y">
                      {savedGames.map((game) => (
                        <li key={game} className="py-2">
                          <button
                            className="w-full text-left px-2 py-1 hover:bg-blue-100 rounded"
                            onClick={() => handleLoad(game)}
                          >
                            {game}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveLoadMenu;
