// pages/index.tsx
"use client"
import { useState, useEffect } from 'react';
import Chessboard from '../components/Chessboard';
import MatrixBackground from '../components/MatrixBackground';

// Keep the Telegram WebApp type declaration
declare global {
  interface Window {
    Telegram?: { WebApp: WebApp; } | undefined;
  }
}

// Define the WebApp type structure based on typical usage
// (You might need to adjust this based on the specific methods you use)
interface WebAppMainButton {
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  isVisible: boolean; // Good practice to check visibility
  isActive: boolean; // Good practice to check activity state
}

interface WebApp {
  ready: () => void;
  MainButton: WebAppMainButton;
  // Add other WebApp properties/methods if you use them
  initDataUnsafe?: object; // Example
  colorScheme?: string;  // Example
  close?: () => void; // Example
}


export default function Home() {
  const [showGame, setShowGame] = useState(false);
  // Add state to track if we are in the Telegram environment
  const [isTelegramEnvironment, setIsTelegramEnvironment] = useState(false);
  const [isClient, setIsClient] = useState(false); // Ensure code runs only on client

  useEffect(() => {
    setIsClient(true); // Component has mounted, we are on the client
  }, []);

  useEffect(() => {
    // Only run detection logic on the client side
    if (!isClient) {
      return;
    }

    const webapp = window.Telegram?.WebApp;

    // Check if Telegram WebApp is available and has the necessary parts
    if (webapp && typeof webapp.ready === 'function' && webapp.MainButton) {
      setIsTelegramEnvironment(true); // We are inside Telegram

      webapp.ready();

      // --- Telegram-Specific Button Logic ---
      const handleTelegramButtonClick = () => {
        // Check if the button is still meant to be active before proceeding
        if (webapp.MainButton.isVisible && webapp.MainButton.isActive) {
            setShowGame(true);
            webapp.MainButton.hide(); // Hide after click
        }
      };

      // Set up the MainButton only if it's not already visible/configured
      // This avoids issues on potential HMR updates or re-renders
      if (!webapp.MainButton.isVisible) {
          webapp.MainButton.setText("Start Game");
          // Important: Remove previous listener before adding a new one
          // This prevents multiple listeners if the effect runs again
          webapp.MainButton.offClick(handleTelegramButtonClick); // Assuming an 'offClick' exists or manage listeners carefully
          webapp.MainButton.onClick(handleTelegramButtonClick);
          webapp.MainButton.show();
      }

      // Cleanup function for Telegram environment
      return () => {
        // Only try to hide if it's likely the Telegram environment
        // and the button might still exist/be visible
        if (window.Telegram?.WebApp?.MainButton && window.Telegram.WebApp.MainButton.isVisible) {
            // Consider removing the listener as well during cleanup
            window.Telegram.WebApp.MainButton.offClick(handleTelegramButtonClick);
            window.Telegram.WebApp.MainButton.hide();
        }
      };
      // --- End Telegram-Specific Button Logic ---

    } else {
      // --- Non-Telegram Environment ---
      setIsTelegramEnvironment(false);
      // No specific setup needed here, the regular button will be rendered conditionally via JSX
      console.log("Running outside Telegram environment.");
    }

  }, [isClient]); // Depend on isClient to ensure it runs after mount

  const handleStandardButtonClick = () => {
    setShowGame(true);
  };

  // Prevent rendering anything until client-side check is complete
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    // Added flex-col and relative positioning for the button container
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 relative p-4">
      <MatrixBackground />

      {/* --- Conditional Start Button --- */}
      {/* Show standard button ONLY if NOT in Telegram AND game hasn't started */}
      {!isTelegramEnvironment && !showGame && (
        <div className="absolute inset-0 flex justify-center items-center z-10">
           {/* Added a container div for centering */}
          <button
            onClick={handleStandardButtonClick}
            className="px-8 py-4 bg-green-600 text-white rounded-lg text-2xl font-bold hover:bg-green-700 transition duration-200 shadow-lg"
          >
            Start Game
          </button>
        </div>
      )}

      {/* --- Chessboard Modal --- */}
      {/* Conditional rendering of the Chessboard in a modal popup */}
      {showGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Modal background */}
          <div className="fixed inset-0 bg-black opacity-60"></div>
          {/* Modal content - Adjusted width/height for better display */}
          <div className="relative bg-gray-900 p-1 md:p-2 rounded-lg shadow-xl z-50 max-w-full max-h-full overflow-auto">
            {/* Optional: Add a close button if needed for the modal */}
             {/* <button
               onClick={() => setShowGame(false)}
               className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-1 z-50"
             >
               X
            </button> */}
            <Chessboard />
          </div>
        </div>
      )}

      {/* Optional: Footer or other elements */}
      {!showGame && (
         <p className="text-gray-400 absolute bottom-5 z-10 text-sm">
            {isTelegramEnvironment ? 'Tap "Start Game" below' : 'Click "Start Game" to begin'}
         </p>
      )}
    </div>
  );
}