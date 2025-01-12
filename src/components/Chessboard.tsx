"use client";
import Image from "next/image";
// components/Chessboard.tsx
import { useState, useEffect, useRef } from 'react';
import { Chess, Square, Piece as ChessJSPiece, Move } from 'chess.js';
import Piece from './Piece';

type SquareType = ChessJSPiece | null;
type BoardType = SquareType[][];

const Chessboard: React.FC = () => {
  // Use useRef to store the 'game' object
  const gameRef = useRef<Chess>(new Chess());

  // State to trigger re-renders when the game state changes
  const [, setGameState] = useState(0);

  // Store the board state
  const [boardState, setBoardState] = useState<BoardType>(gameRef.current.board());

  // Selected square
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Possible moves from selected square
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  // Convert row and column to algebraic notation
  const getSquareNotation = (row: number, col: number): Square => {
    const files = 'abcdefgh';
    return (files[col] + (8 - row)) as Square;
  };

  const handleSquareClick = (row: number, col: number) => {
    const clickedSquare = getSquareNotation(row, col);
    const game = gameRef.current;

    const piece = game.get(clickedSquare);

    // If a piece is already selected
    if (selectedSquare) {
      // Attempt to make the move
      const move = game.move({ from: selectedSquare, to: clickedSquare, promotion: 'q' });
      if (move) {
        // Move was successful
        setBoardState([...game.board()]);
        setSelectedSquare(null);
        setPossibleMoves([]);
        // Force re-render
        setGameState((prev) => prev + 1);
        console.log("Move successful");

        // Check for game over conditions
        if (game.game_over()) {
          if (game.in_checkmate()) {
            alert('Checkmate!');
          } else if (game.in_stalemate()) {
            alert('Stalemate!');
          } else if (game.in_draw()) {
            alert('Draw!');
          }
        }
      } else {
        // Move was invalid
        setSelectedSquare(null);
        setPossibleMoves([]);
        console.log("Invalid move");
      }
    } else {
      // No piece selected yet
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(clickedSquare);
        // Get possible moves
        const moves = game.moves({ square: clickedSquare, verbose: true }) as Move[];
        const destinations = moves.map((move) => move.to as Square);
        setPossibleMoves(destinations);
      }
    }
  };

  const renderSquare = (square: SquareType, row: number, col: number) => {
    const isWhiteSquare = (row + col) % 2 === 0;
    const squareNotation = getSquareNotation(row, col);
    const isSelected = selectedSquare === squareNotation;
    const isPossibleMove = possibleMoves.includes(squareNotation);

    return (
      <div
        key={`${row},${col}`}
        className={`w-16 h-16 relative ${
          isWhiteSquare ? 'bg-gray-900' : 'bg-green-600'
        } ${isSelected ? 'border-4 border-yellow-500' : ''}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {square && square.type && (
          <Piece piece={square} />
        )}
        {isPossibleMove && (
          <div className="absolute inset-0 bg-yellow-300 opacity-50"></div>
        )}
      </div>
    );
  };

  return (
    <div>
      {boardState.map((rowArray, rowIdx) => (
        <div key={rowIdx} className="flex">
          {rowArray.map((square, colIdx) =>
            renderSquare(square, rowIdx, colIdx)
          )}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;