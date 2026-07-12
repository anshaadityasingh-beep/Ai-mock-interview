import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const ChatWindow = ({ sessionId, initialMessage, onSessionComplete }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: initialMessage },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/interview/message', {
        sessionId,
        message: trimmed,
      });

      setMessages((prev) => [...prev, { role: 'ai', text: res.data.aiMessage }]);

      if (res.data.status === 'completed') {
        onSessionComplete();
      }
    } catch (err) {
      setError('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role === 'ai' ? 'ai-bubble' : 'user-bubble'}`}>
            <span className="bubble-label">{msg.role === 'ai' ? 'Interviewer' : 'You'}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble ai-bubble">
            <span className="bubble-label">Interviewer</span>
            <LoadingSpinner small />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {error && (
        <p className="error-text" style={{ margin: '0 1.5rem' }}>
          {error.includes('500') || error.includes('Failed')
            ? '⚠️ The AI interviewer is a bit busy right now. Please try again in a moment.'
            : error}
        </p>
      )}
      <div className="chat-input-row">
        <textarea
          id="chat-input"
          className="chat-input"
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button
          id="chat-send-btn"
          className="send-btn"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
