"use client"
import Image from "next/image";
// components/Chessboard.js
import  { useState, useEffect } from 'react';
import Piece from './Piece';
import { Chess } from 'chess.js';

const Chessboard = () => {
  const [game, setGame] = useState(null);
  const [boardState, setBoardState] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);


  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setBoardState(newGame.board());
  }, []);


    const board = [];
  
  

    const getSquareNotation = (row, col) => {
      const files = 'abcdefgh';
      return files[col] + (8 - row);
    };




    

    const handleSquareClick = (row, col) => {
      const clickedSquare = getSquareNotation(row, col);
      const piece = game.get(clickedSquare);
    
      if (selectedSquare) {
        // Attempt to make the move
        const move = game.move({ from: selectedSquare, to: clickedSquare });
        if (move) {
          // Move was successful
          setBoardState(game.board());
          setSelectedSquare(null);
          setPossibleMoves([]);
          console.log("moveee")

        } else {
          // Move was invalid
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      } else {
        if (piece) {
          setSelectedSquare(clickedSquare);
          // Get possible moves
          const moves = game.moves({ square: clickedSquare, verbose: true });
          const destinations = moves.map((move) => move.to);
          setPossibleMoves(destinations);
        }
      }
    };
    


 



    const renderSquare = (square, row, col) => {
      const isWhiteSquare = (row + col) % 2 === 0;
      const squareNotation = getSquareNotation(row, col);
      const isSelected = selectedSquare === squareNotation;
      const isPossibleMove = possibleMoves.includes(squareNotation);


      return (
        <div
          key={`${row},${col}`}
          className={`w-16 h-16 ${
            isWhiteSquare ? 'bg-gray-900' : 'bg-green-600'
          } ${isSelected ? 'border-4 border-yellow-500' : ''}`}
          onClick={() => handleSquareClick(row, col)}
        >
          {square && square.type && (
            <Piece piece={{ type: square.type, color: square.color }} />
          )}
          
          {isPossibleMove && (
            <div className="absolute inset-0 bg-yellow-300 opacity-50"></div>
          )
          }
        </div>
      );
    };



  




    return (
      <div>
        { boardState.map((rowArray, rowIdx) => (
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