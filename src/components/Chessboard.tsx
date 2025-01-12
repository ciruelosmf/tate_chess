import Image from "next/image";
// components/Chessboard.js
 

const Chessboard = () => {
    const board = [];
  
    for (let row = 7; row >= 0; row--) {
      const squares = [];
      for (let col = 0; col < 8; col++) {
        const isWhiteSquare = (row + col) % 2 === 0;
        squares.push(
          <div
            key={`${row},${col}`}
            className={`w-16 h-16 ${isWhiteSquare ? 'bg-gray-200' : 'bg-green-600'}`}
          >
            {/* Piece will be added here later */}
          </div>
        );
      }
      board.push(
        <div key={row} className="flex">
          {squares}
        </div>
      );
    }
  
    return <div>{board}</div>;
  };

export default Chessboard;