import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Static set of quiz questions related to Indonesian independence. Each question
// has a text, an array of options, and the index of the correct answer in the
// options array.
const questions = [
  {
    question: 'Pada tanggal berapa Indonesia merdeka?',
    options: ['17 Juli 1945', '17 Agustus 1945', '1 Juni 1945', '25 Desember 1945'],
    answer: 1,
  },
  {
    question: 'Siapa yang memproklamasikan kemerdekaan Indonesia?',
    options: ['Soekarno dan Hatta', 'Sudirman dan Diponegoro', 'Soekarno dan Soedirman', 'Hatta dan Diponegoro'],
    answer: 0,
  },
  {
    question: 'Apa nama teks yang dibacakan saat proklamasi?',
    options: ['Pembukaan UUD 1945', 'Teks Proklamasi', 'Sumpah Pemuda', 'Pancasila'],
    answer: 1,
  },
  {
    question: 'Apa warna bendera Indonesia?',
    options: ['Merah-putih', 'Biru-putih', 'Hijau-putih', 'Merah-kuning'],
    answer: 0,
  },
  {
    question: 'Di mana proklamasi dibacakan?',
    options: ['Istana Merdeka', 'Rengasdengklok', 'Jalan Pegangsaan Timur 56', 'Lapangan Banteng'],
    answer: 2,
  },
];

/**
 * QuizBlitz presents a series of multiple-choice questions to the player. Each
 * question has a 15 second timer. Points are awarded for correct answers and
 * the final score is saved to Firestore when the quiz ends. When time runs
 * out on a question, it automatically advances to the next.
 *
 * @param {Object} props
 * @param {string} props.nickname Player nickname used to save the score.
 * @param {Function} props.onGameEnd Callback fired when the quiz ends.
 */
const QuizBlitz = ({ nickname, onGameEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finished, setFinished] = useState(false);

  // Countdown timer for each question
  useEffect(() => {
    if (finished) return;
    if (timeLeft === 0) {
      // When time expires, move to next question
      nextQuestion();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  // Proceed to next question or finish the quiz if last question
  const nextQuestion = () => {
    setTimeLeft(15);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishQuiz();
    }
  };

  // Handle answer selection
  const chooseOption = (idx) => {
    if (finished) return;
    if (idx === questions[currentIndex].answer) {
      setScore((s) => s + 10);
    }
    nextQuestion();
  };

  // Finish quiz: save score to Firestore and notify parent
  const finishQuiz = () => {
    setFinished(true);
    if (nickname) {
      addDoc(collection(db, 'scores'), {
        nickname,
        score,
        game: 'quiz',
        timestamp: serverTimestamp(),
      }).catch((err) => console.error('Error saving score', err));
    }
    if (onGameEnd) onGameEnd(score);
  };

  // Reset quiz state to play again
  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(15);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-xl font-bold mb-2">Quiz Selesai</h3>
        <p className="mb-2">Skor kamu: {score}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={resetQuiz}
        >
          Main Lagi
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between mb-2 text-sm font-semibold">
        <span>Pertanyaan {currentIndex + 1}/{questions.length}</span>
        <span>Waktu: {timeLeft}s</span>
      </div>
      <h3 className="font-bold mb-4 text-base">{q.question}</h3>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => chooseOption(idx)}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-2 rounded text-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizBlitz;