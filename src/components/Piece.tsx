import Image from "next/image";
 
 

// components/Piece.js
 

const Piece = ({ piece }) => {
  // Determine the Unicode character or image for the piece
  // Example using Unicode characters:
  const unicodePieces = {
    p: { b: '♟', w: '♙' },
    n: { b: '♞', w: '♘' },
    b: { b: '♝', w: '♗' },
    r: { b: '♜', w: '♖' },
    q: { b: '♛', w: '♕' },
    k: { b: '♚', w: '♔' },
  };

  const code = unicodePieces[piece.type][piece.color];

  return (
    <div className="text-4xl flex justify-center items-center h-full">
      {code}
    </div>
  );
};

export default Piece;