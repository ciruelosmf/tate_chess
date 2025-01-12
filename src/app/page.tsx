import Image from "next/image";
import Chessboard from '../components/Chessboard';



export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <Chessboard />
    </div>
  );
}
