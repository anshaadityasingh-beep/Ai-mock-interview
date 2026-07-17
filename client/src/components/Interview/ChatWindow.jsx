import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import { speakText, stopSpeaking, startListening, stopListening } from '../../services/speechService';

const ChatWindow = ({ sessionId, initialMessage, onSessionComplete }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: initialMessage },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voiceMode, setVoiceMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const bottomRef = useRef(null);
  const hasSpokenInitial = useRef(false);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speak the initial AI message when voice mode is on
  useEffect(() => {
    if (voiceMode && initialMessage && !hasSpokenInitial.current) {
      hasSpokenInitial.current = true;
      setIsSpeaking(true);
      speakText(initialMessage, () => {
        setIsSpeaking(false);
      });
    }
  }, [voiceMode, initialMessage]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setVoiceError('');

    // Stop any ongoing speech when user sends a message
    stopSpeaking();
    setIsSpeaking(false);

    try {
      const res = await api.post('/api/interview/message', {
        sessionId,
        message: trimmed,
      });

      const aiText = res.data.aiMessage;
      setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);

      // Speak AI response if voice mode is on
      if (voiceMode) {
        setIsSpeaking(true);
        speakText(aiText, () => {
          setIsSpeaking(false);
        });
      }

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

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    setVoiceError('');
    setIsListening(true);

    // Stop any ongoing speech when user starts speaking
    stopSpeaking();
    setIsSpeaking(false);

    startListening(
      (transcribedText) => {
        setInput((prev) => (prev ? prev + ' ' + transcribedText : transcribedText));
        setIsListening(false);
      },
      (errorMessage) => {
        setVoiceError(errorMessage);
        setIsListening(false);
      }
    );
  };

  const handleVoiceToggle = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    if (!newMode) {
      // Turning voice off — stop any active speech/listening
      stopSpeaking();
      stopListening();
      setIsSpeaking(false);
      setIsListening(false);
    }
    setVoiceError('');
  };

  return (
    <div className="chat-window">
      {/* Voice mode toolbar */}
      <div className="voice-toolbar">
        <div className="voice-toggle-wrapper">
          <button
            id="voice-mode-toggle"
            className={`voice-toggle-btn ${voiceMode ? 'active' : ''}`}
            onClick={handleVoiceToggle}
            title={voiceMode ? 'Switch to Text Mode' : 'Switch to Voice Mode'}
          >
            <span className="voice-toggle-icon">{voiceMode ? '🎙️' : '⌨️'}</span>
            <span className="voice-toggle-label">{voiceMode ? 'Voice Mode' : 'Text Mode'}</span>
          </button>
          {isSpeaking && (
            <span className="speaking-indicator">
              <span className="speaking-dot"></span>
              Speaking...
            </span>
          )}
        </div>
        <span className="voice-compat-note">Voice mode works best in Chrome</span>
      </div>

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
      {voiceError && (
        <p className="voice-error-text" style={{ margin: '0 1.5rem' }}>
          ⚠️ {voiceError}
        </p>
      )}

      <div className="chat-input-row">
        {voiceMode && (
          <button
            id="mic-btn"
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleMicClick}
            disabled={loading}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <svg className="mic-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            {isListening && <span className="mic-pulse"></span>}
          </button>
        )}
        <textarea
          id="chat-input"
          className="chat-input"
          placeholder={isListening ? 'Listening... speak now' : 'Type your answer...'}
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
