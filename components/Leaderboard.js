import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Leaderboard component shows top scores from the `scores` collection in Firestore.
 * Scores are sorted descending by the `score` field and limited to the top 10 entries.
 */
const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
      <ul>
        {scores.map((s, idx) => (
          <li key={idx} className="flex justify-between border-b py-1 text-sm">
            <span>
              {idx + 1}. {s.nickname}
            </span>
            <span>{s.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;