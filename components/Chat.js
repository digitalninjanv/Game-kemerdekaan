import { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Global chat component that displays messages and allows users to send messages.
 * Messages are stored in a Firestore collection named `chatMessages` and ordered
 * by their timestamp. The component auto-scrolls to the newest message.
 *
 * @param {Object} props
 * @param {string} props.nickname The nickname of the current user used as sender name.
 */
const Chat = ({ nickname }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Subscribe to chat messages on mount
  useEffect(() => {
    const q = query(collection(db, 'chatMessages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a new message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      await addDoc(collection(db, 'chatMessages'), {
        text: newMessage.trim(),
        sender: nickname || 'Anonymous',
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-60 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold">{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ketik pesan..."
          className="flex-1 border rounded-l px-2 py-1"
        />
        <button
          onClick={sendMessage}
          className="bg-red-600 text-white px-4 py-1 rounded-r"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default Chat;