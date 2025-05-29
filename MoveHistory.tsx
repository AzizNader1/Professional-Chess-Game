import React, { useState } from 'react';
import { Move } from '../../types/chess';

interface MoveHistoryProps {
  moves: Move[];
  onMoveClick?: (index: number) => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, onMoveClick }) => {
  const [expanded, setExpanded] = useState(true);

  // Format position to algebraic notation (e.g., e4)
  const formatPosition = (position: { row: number; col: number }): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[position.col] + ranks[position.row];
  };

  // Format move to algebraic notation
  const formatMove = (move: Move): string => {
    const pieceSymbols: Record<string, string> = {
      pawn: '',
      knight: 'N',
      bishop: 'B',
      rook: 'R',
      queen: 'Q',
      king: 'K'
    };

    let notation = pieceSymbols[move.piece.type];
    
    // For pawns capturing, include the file
    if (move.piece.type === 'pawn' && move.capturedPiece) {
      notation += formatPosition(move.from)[0] + 'x';
    } else if (move.capturedPiece) {
      notation += 'x';
    }
    
    notation += formatPosition(move.to);
    
    // Add promotion piece
    if (move.isPromotion && move.promotionPiece) {
      notation += '=' + pieceSymbols[move.promotionPiece].toUpperCase();
    }
    
    // Add check or checkmate symbol
    // This would require additional game state information
    
    return notation;
  };

  // Group moves by turn number
  const groupedMoves = moves.reduce<Array<{ white: Move | null; black: Move | null }>>((acc, move, index) => {
    const turnNumber = Math.floor(index / 2);
    
    if (!acc[turnNumber]) {
      acc[turnNumber] = { white: null, black: null };
    }
    
    if (index % 2 === 0) {
      acc[turnNumber].white = move;
    } else {
      acc[turnNumber].black = move;
    }
    
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Move History</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? '▼' : '▲'}
        </button>
      </div>
      
      {expanded && (
        <div className="overflow-y-auto max-h-80">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 text-left w-10">#</th>
                <th className="py-2 px-2 text-left">White</th>
                <th className="py-2 px-2 text-left">Black</th>
              </tr>
            </thead>
            <tbody>
              {groupedMoves.map((turn, turnIndex) => (
                <tr key={turnIndex} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 text-gray-500">{turnIndex + 1}</td>
                  <td 
                    className={`py-2 px-2 ${onMoveClick ? 'cursor-pointer hover:bg-blue-100' : ''}`}
                    onClick={() => onMoveClick && turn.white && onMoveClick(turnIndex * 2)}
                  >
                    {turn.white && formatMove(turn.white)}
                  </td>
                  <td 
                    className={`py-2 px-2 ${onMoveClick ? 'cursor-pointer hover:bg-blue-100' : ''}`}
                    onClick={() => onMoveClick && turn.black && onMoveClick(turnIndex * 2 + 1)}
                  >
                    {turn.black && formatMove(turn.black)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
