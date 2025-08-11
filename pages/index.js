import { useState, useEffect } from 'react';
import { signInAnonymously, auth } from '../firebaseConfig';
import Chat from '../components/Chat';
import Leaderboard from '../components/Leaderboard';
import GameSelector from '../components/GameSelector';
import dynamic from 'next/dynamic';

// Dynamically import game components to disable server-side rendering for interactive features
const DroneRace = dynamic(() => import('../components/games/DroneRace'), { ssr: false });
const QuizBlitz = dynamic(() => import('../components/games/QuizBlitz'), { ssr: false });
const EmojiSprint = dynamic(() => import('../components/games/EmojiSprint'), { ssr: false });

/**
 * The main page of the Lomba 17-an Online web app. Users choose a nickname,
 * pick a game mode, and then play while chatting and watching the leaderboard.
 */
export default function Home() {
  const [nickname, setNickname] = useState('');
  const [entered, setEntered] = useState(false);
  const [selectedGame, setSelectedGame] = useState('drone');
  const [lastScore, setLastScore] = useState(null);

  // Sign in anonymously with Firebase on mount
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.error('Firebase auth error', error);
    });
  }, []);

  // Handle nickname submission
  const handleStart = () => {
    if (nickname.trim()) {
      setEntered(true);
    }
  };

  // Callback passed to game components to receive the final score
  const handleGameEnd = (score) => {
    setLastScore(score);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Lomba 17-an Online
      </h1>
      {!entered ? (
        // Nickname entry form
        <div className="bg-white p-4 rounded shadow-md w-80">
          <label className="block mb-2 font-semibold">Masukkan Nickname:</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            placeholder="Contoh: Pemenang77"
          />
          <button
            onClick={handleStart}
            className="bg-red-600 text-white px-4 py-2 rounded w-full"
          >
            Masuk
          </button>
        </div>
      ) : (
        <>
          {/* Game mode selection buttons */}
          <GameSelector
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
          />
          {/* Display last score after game ends */}
          {lastScore !== null && (
            <div className="mb-4 text-green-700 font-semibold">
              Skor Terakhir: {lastScore}
            </div>
          )}
          <div className="flex flex-col lg:flex-row w-full max-w-4xl space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Game area */}
            <div className="flex-1">
              {selectedGame === 'drone' && (
                <DroneRace nickname={nickname} onGameEnd={handleGameEnd} />
              )}
              {selectedGame === 'quiz' && (
                <QuizBlitz nickname={nickname} onGameEnd={handleGameEnd} />
              )}
              {selectedGame === 'emoji' && (
                <EmojiSprint nickname={nickname} onGameEnd={handleGameEnd} />
              )}
            </div>
            {/* Sidebar for leaderboard and chat */}
            <div className="w-full lg:w-1/3 space-y-4">
              <Leaderboard />
              <Chat nickname={nickname} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}