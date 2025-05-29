import React, { useState, useEffect } from 'react';
import { GameState, Position } from '../../types/chess';
import { getValidMoves, makeMove, generateAIMove } from '../../models/chess';
import ChessPiece from './ChessPiece';

interface ChessBoardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ gameState, setGameState }) => {
  const [draggedPiece, setDraggedPiece] = useState<Position | null>(null);
  
  // Handle AI moves
  useEffect(() => {
    if (gameState.gameMode === 'ai' && gameState.currentTurn === 'black' && !gameState.isCheckmate && !gameState.isStalemate) {
      // Add a small delay to make AI moves feel more natural
      const aiTimer = setTimeout(() => {
        const aiMove = generateAIMove(gameState, gameState.aiDifficulty || 'medium');
        if (aiMove) {
          const newGameState = makeMove(gameState, aiMove.from, aiMove.to);
          setGameState(newGameState);
        }
      }, 500);
      
      return () => clearTimeout(aiTimer);
    }
  }, [gameState, setGameState]);
  
  // Handle game timer
  useEffect(() => {
    if (gameState.timeControl.enabled && !gameState.isCheckmate && !gameState.isStalemate) {
      const timerInterval = setInterval(() => {
        setGameState(prevState => {
          const newState = { ...prevState };
          
          if (newState.currentTurn === 'white') {
            newState.timeControl.whiteTime = Math.max(0, newState.timeControl.whiteTime - 1);
            
            // Check for timeout
            if (newState.timeControl.whiteTime === 0) {
              newState.isCheckmate = true; // Using checkmate state for timeout
            }
          } else {
            newState.timeControl.blackTime = Math.max(0, newState.timeControl.blackTime - 1);
            
            // Check for timeout
            if (newState.timeControl.blackTime === 0) {
              newState.isCheckmate = true; // Using checkmate state for timeout
            }
          }
          
          return newState;
        });
      }, 1000);
      
      return () => clearInterval(timerInterval);
    }
  }, [gameState.timeControl.enabled, gameState.isCheckmate, gameState.isStalemate, setGameState, gameState.currentTurn]);
  
  const handleSquareClick = (row: number, col: number) => {
    // If game is over, don't allow moves
    if (gameState.isCheckmate || gameState.isStalemate) return;
    
    // If it's AI's turn and we're in AI mode, don't allow player to move for AI
    if (gameState.gameMode === 'ai' && gameState.currentTurn === 'black') return;
    
    const clickedPosition: Position = { row, col };
    const clickedSquare = gameState.board[row][col];
    
    // If a piece is already selected
    if (gameState.selectedPiece) {
      // Check if clicked on a valid move position
      const isValidMove = gameState.validMoves.some(
        pos => pos.row === row && pos.col === col
      );
      
      if (isValidMove) {
        // Make the move
        const newGameState = makeMove(gameState, gameState.selectedPiece, clickedPosition);
        setGameState(newGameState);
        return;
      }
      
      // If clicked on another own piece, select that piece instead
      if (clickedSquare.piece && clickedSquare.piece.color === gameState.currentTurn) {
        const validMoves = getValidMoves(gameState, clickedPosition);
        
        setGameState({
          ...gameState,
          selectedPiece: clickedPosition,
          validMoves
        });
        return;
      }
      
      // If clicked elsewhere, deselect the piece
      setGameState({
        ...gameState,
        selectedPiece: null,
        validMoves: []
      });
      return;
    }
    
    // If no piece is selected yet, select a piece if it's the current player's
    if (clickedSquare.piece && clickedSquare.piece.color === gameState.currentTurn) {
      const validMoves = getValidMoves(gameState, clickedPosition);
      
      setGameState({
        ...gameState,
        selectedPiece: clickedPosition,
        validMoves
      });
    }
  };
  
  const handleDragStart = (row: number, col: number) => {
    // If game is over, don't allow moves
    if (gameState.isCheckmate || gameState.isStalemate) return;
    
    // If it's AI's turn and we're in AI mode, don't allow player to move for AI
    if (gameState.gameMode === 'ai' && gameState.currentTurn === 'black') return;
    
    const piece = gameState.board[row][col].piece;
    
    if (piece && piece.color === gameState.currentTurn) {
      setDraggedPiece({ row, col });
      
      const validMoves = getValidMoves(gameState, { row, col });
      
      setGameState({
        ...gameState,
        selectedPiece: { row, col },
        validMoves
      });
    }
  };
  
  const handleDragEnd = (row: number, col: number) => {
    if (!draggedPiece) return;
    
    const targetPosition: Position = { row, col };
    
    // Check if this is a valid move
    const isValidMove = gameState.validMoves.some(
      pos => pos.row === row && pos.col === col
    );
    
    if (isValidMove) {
      // Make the move
      const newGameState = makeMove(gameState, draggedPiece, targetPosition);
      setGameState(newGameState);
    } else {
      // Invalid move, just deselect
      setGameState({
        ...gameState,
        selectedPiece: null,
        validMoves: []
      });
    }
    
    setDraggedPiece(null);
  };
  
  // Determine square color
  const getSquareColor = (row: number, col: number) => {
    const isEven = (row + col) % 2 === 0;
    return isEven ? 'bg-amber-200' : 'bg-amber-800';
  };
  
  // Determine if a square should be highlighted
  const isHighlighted = (row: number, col: number) => {
    return gameState.validMoves.some(pos => pos.row === row && pos.col === col);
  };
  
  // Determine if a square is selected
  const isSelected = (row: number, col: number) => {
    return gameState.selectedPiece?.row === row && gameState.selectedPiece?.col === col;
  };
  
  // Determine if a square is part of the last move
  const isLastMove = (row: number, col: number) => {
    return gameState.board[row][col].isLastMove;
  };
  
  // Determine if the king is in check
  const isKingInCheck = (row: number, col: number) => {
    const square = gameState.board[row][col];
    return square.piece?.type === 'king' && gameState.isCheck && square.piece.color === gameState.currentTurn;
  };
  
  // Render board coordinates
  const renderCoordinates = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    return (
      <>
        {/* File coordinates (bottom) */}
        <div className="flex">
          <div className="w-8"></div>
          {files.map((file) => (
            <div key={file} className="w-16 h-8 flex items-center justify-center text-sm font-medium">
              {file}
            </div>
          ))}
        </div>
        
        {/* Rank coordinates (left side) */}
        <div className="absolute left-0 top-0 h-full flex flex-col">
          {ranks.map((rank) => (
            <div key={rank} className="w-8 h-16 flex items-center justify-center text-sm font-medium">
              {rank}
            </div>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <div className="relative">
      <div className="flex">
        <div className="w-8"></div>
        <div className="border-4 border-amber-900 shadow-xl">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((square, colIndex) => {
                const squareColor = getSquareColor(rowIndex, colIndex);
                const highlighted = isHighlighted(rowIndex, colIndex);
                const selected = isSelected(rowIndex, colIndex);
                const lastMove = isLastMove(rowIndex, colIndex);
                const kingInCheck = isKingInCheck(rowIndex, colIndex);
                
                return (
                  <div
                    key={colIndex}
                    className={`
                      w-16 h-16 relative
                      ${squareColor}
                      ${highlighted ? 'after:absolute after:inset-0 after:bg-green-500 after:opacity-40 after:rounded-full after:m-5' : ''}
                      ${selected ? 'ring-4 ring-blue-500 ring-inset z-10' : ''}
                      ${lastMove ? 'ring-2 ring-yellow-400 ring-inset' : ''}
                      ${kingInCheck ? 'ring-4 ring-red-600 ring-inset' : ''}
                    `}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDragEnd(rowIndex, colIndex)}
                  >
                    {square.piece && (
                      <ChessPiece
                        piece={square.piece}
                        onDragStart={() => handleDragStart(rowIndex, colIndex)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {renderCoordinates()}
      
      {/* Game status overlay */}
      {(gameState.isCheckmate || gameState.isStalemate) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              {gameState.isCheckmate 
                ? `Checkmate! ${gameState.currentTurn === 'white' ? 'Black' : 'White'} wins!`
                : 'Stalemate! The game is a draw.'}
            </h2>
            <p className="mb-4">
              {gameState.isCheckmate 
                ? `${gameState.currentTurn === 'white' ? 'Black' : 'White'} has won the game.`
                : 'Neither player can make a legal move.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
