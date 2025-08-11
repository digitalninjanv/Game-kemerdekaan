import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Array of emojis used in the typing game
const emojiList = [
  '😀',
  '😂',
  '🤣',
  '😅',
  '😊',
  '😍',
  '🤔',
  '😴',
  '😎',
  '😭',
  '🤯',
  '💃',
  '🎉',
  '🔥',
  '👍',
  '👎',
  '🚀',
  '🍕',
  '🍦',
  '🥳',
];

// Generate a random string of emojis of the given length
const generateEmojis = (length = 4) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += emojiList[Math.floor(Math.random() * emojiList.length)];
  }
  return result;
};

/**
 * EmojiSprint challenges the player to type a sequence of random emojis as fast
 * as possible within a limited time. Each correctly typed sequence increases
 * the score. When time expires, the final score is saved to Firestore.
 *
 * @param {Object} props
 * @param {string} props.nickname Player nickname used to save the score.
 * @param {Function} props.onGameEnd Callback fired when the time runs out.
 */
const EmojiSprint = ({ nickname, onGameEnd }) => {
  const [target, setTarget] = useState(generateEmojis());
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (finished) return;
    if (timeLeft === 0) {
      // Time's up: finish game
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  // Handle text input and check if it matches the target string
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === target) {
      setScore((s) => s + 10);
      setTarget(generateEmojis());
      setInputValue('');
    }
  };

  // Finish game: save score and notify parent
  const finishGame = () => {
    setFinished(true);
    if (nickname) {
      addDoc(collection(db, 'scores'), {
        nickname,
        score,
        game: 'emoji',
        timestamp: serverTimestamp(),
      }).catch((err) => console.error('Error saving score', err));
    }
    if (onGameEnd) onGameEnd(score);
  };

  // Reset state for a new round
  const resetGame = () => {
    setTarget(generateEmojis());
    setInputValue('');
    setScore(0);
    setTimeLeft(30);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-xl font-bold mb-2">Waktu Habis</h3>
        <p className="mb-2">Skor kamu: {score}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={resetGame}
        >
          Main Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between mb-2 text-sm font-semibold">
        <span>Skor: {score}</span>
        <span>Waktu: {timeLeft}s</span>
      </div>
      <div className="text-3xl mb-4 break-all">
        {target}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="w-full border px-2 py-2 rounded text-lg"
        placeholder="Ketik emoji di sini"
      />
    </div>
  );
};

export default EmojiSprint;