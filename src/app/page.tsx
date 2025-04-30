// pages/index.tsx
"use client"
import { useState, useEffect } from 'react';
import Chessboard from '../components/Chessboard';
import MatrixBackground from '../components/MatrixBackground';

declare global {
  interface Window {
    Telegram?: { WebApp: WebApp; } | undefined;
  }
}

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Set initialized to true to prevent flickering
    setInitialized(true);
    
    // Check if Telegram WebApp is available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webapp = window.Telegram.WebApp;
      setIsTelegramApp(true);

      // Ensure WebApp is only initialized on the client side
      if (typeof webapp.ready === 'function') {
        webapp.ready();
      }

      // Set up the MainButton
      webapp.MainButton.setText("Start Game");
      webapp.MainButton.onClick(() => {
        setShowGame(true);
        // Hide the MainButton since the game has started
        webapp.MainButton.hide();
      });
      webapp.MainButton.show();

      // Cleanup function to hide the button when the component unmounts
      return () => {
        webapp.MainButton.hide();
      };
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800">
      <MatrixBackground />

      {/* Show standard start button if not in Telegram and app is initialized */}
      {initialized && !isTelegramApp && !showGame && (
        <button 
          onClick={() => setShowGame(true)}
          className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-green-700 transition-colors z-20 animate-pulse fixed"
        >
          Start Game
        </button>
      )}

      {/* Conditional rendering of the Chessboard in a modal popup */}
      {showGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal background */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          {/* Modal content */}
          <div className="relative z-50 rounded-lg">
            <Chessboard />
          </div>
        </div>
      )}
    </div>
  );
}