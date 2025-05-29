import React from 'react';
import { ChessPiece as ChessPieceType } from '../../types/chess';

interface ChessPieceProps {
  piece: ChessPieceType;
  onDragStart: () => void;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, onDragStart }) => {
  // Get the piece icon based on type and color
  const getPieceIcon = () => {
    const { type, color } = piece;
    
    // Map of piece types to Unicode chess symbols
    const pieceIcons: Record<string, string> = {
      'white-pawn': '♙',
      'white-rook': '♖',
      'white-knight': '♘',
      'white-bishop': '♗',
      'white-queen': '♕',
      'white-king': '♔',
      'black-pawn': '♟',
      'black-rook': '♜',
      'black-knight': '♞',
      'black-bishop': '♝',
      'black-queen': '♛',
      'black-king': '♚'
    };
    
    return pieceIcons[`${color}-${type}`];
  };
  
  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center
        text-5xl cursor-grab active:cursor-grabbing
        select-none
        ${piece.color === 'white' ? 'text-white' : 'text-black'}
        hover:scale-110 transition-transform
      `}
      draggable
      onDragStart={onDragStart}
    >
      {getPieceIcon()}
    </div>
  );
};

export default ChessPiece;
