import { useEffect, useRef, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/**
 * DroneRace is a simple side-scrolling game where the player controls a "drone"
 * moving up and down to avoid obstacles that come from the right. Score increases
 * over time as long as the player avoids collisions. When the player collides,
 * the game ends and the score is saved to Firestore.
 *
 * @param {Object} props
 * @param {string} props.nickname The nickname used to save the score.
 * @param {Function} props.onGameEnd Callback fired when the game finishes with the final score.
 */
const DroneRace = ({ nickname, onGameEnd }) => {
  const [playerY, setPlayerY] = useState(50); // player's vertical position (percentage)
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const animationRef = useRef(null);

  // Handle keyboard input to move the player up and down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        setPlayerY((y) => Math.max(0, y - 5));
      }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        setPlayerY((y) => Math.min(90, y + 5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Game loop: moves obstacles, spawns new ones, checks for collisions, and increases score
  useEffect(() => {
    let lastTime = performance.now();
    let timeSinceLastSpawn = 0;
    const spawnInterval = 2000; // spawn a new obstacle every 2 seconds

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      if (!gameOver) {
        // Increase score over time (scaled by delta time)
        setScore((s) => s + delta / 1000);
        // Move obstacles to the left
        setObstacles((obs) => obs.map((o) => ({ ...o, x: o.x - delta * 0.1 })));
        // Remove obstacles that are off-screen
        setObstacles((obs) => obs.filter((o) => o.x > -10));
        // Spawn new obstacles at set intervals
        timeSinceLastSpawn += delta;
        if (timeSinceLastSpawn >= spawnInterval) {
          timeSinceLastSpawn = 0;
          const newY = Math.random() * 90;
          setObstacles((obs) => [...obs, { x: 100, y: newY }]);
        }
        // Check for collisions
        setObstacles((obs) => {
          for (let o of obs) {
            // Collision if obstacle near left side and y distance less than 10
            if (o.x < 10 && o.x > -5 && Math.abs(o.y - playerY) < 10) {
              setGameOver(true);
              break;
            }
          }
          return obs;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [playerY, gameOver]);

  // When game ends, save score and notify parent
  useEffect(() => {
    if (gameOver) {
      const finalScore = Math.floor(score);
      // Save score to Firestore if nickname is provided
      if (nickname) {
        addDoc(collection(db, 'scores'), {
          nickname,
          score: finalScore,
          game: 'drone',
          timestamp: serverTimestamp(),
        }).catch((err) => console.error('Error saving score', err));
      }
      if (onGameEnd) onGameEnd(finalScore);
    }
  }, [gameOver]);

  // Reset game state to play again
  const resetGame = () => {
    setPlayerY(50);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-64 bg-blue-100 overflow-hidden rounded-lg">
      {!gameOver ? (
        <>
          {/* Player controlled drone */}
          <div
            className="absolute w-8 h-4 bg-red-500 rounded-full"
            style={{
              left: '5%',
              top: `${playerY}%`,
              transform: 'translateY(-50%)',
            }}
          ></div>
          {/* Obstacles */}
          {obstacles.map((o, idx) => (
            <div
              key={idx}
              className="absolute w-8 h-8 bg-green-600 rounded"
              style={{
                left: `${o.x}%`,
                top: `${o.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          ))}
          {/* Score display */}
          <div className="absolute top-2 left-2 text-sm font-semibold">
            Score: {Math.floor(score)}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full flex-col">
          <h3 className="text-xl font-bold mb-2">Game Over</h3>
          <p className="mb-2">Skor kamu: {Math.floor(score)}</p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={resetGame}
          >
            Main Lagi
          </button>
        </div>
      )}
    </div>
  );
};

export default DroneRace;