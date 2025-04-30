"use client"
import { useState, useEffect } from 'react';
import Chessboard from '../components/Chessboard';
import MatrixBackground from '../components/MatrixBackground';

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
    // No Telegram-specific logic needed anymore
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800">
      <MatrixBackground />
      {initialized && !showGame && (
        <button 
          onClick={() => setShowGame(true)}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-green-700 transition-colors z-20 animate-pulse"
        >
          Start Game
        </button>
      )}
      {showGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50 rounded-lg">
            <Chessboard />
          </div>
        </div>
      )}
    </div>
  );
}