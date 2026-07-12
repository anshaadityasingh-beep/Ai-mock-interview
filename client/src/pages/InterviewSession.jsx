import { useState } from 'react';
import CategorySelector from '../components/Interview/CategorySelector';
import ChatWindow from '../components/Interview/ChatWindow';
import SessionResult from '../components/Interview/SessionResult';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import api from '../services/api';

// Session phases
const PHASE = {
  SELECT: 'select',     // user picking a category
  CHAT: 'chat',         // active interview
  SCORING: 'scoring',   // waiting for Gemini to score
  RESULT: 'result',     // showing the result
};

const InterviewSession = () => {
  const [phase, setPhase] = useState(PHASE.SELECT);
  const [sessionId, setSessionId] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  // Called by CategorySelector when the session is created
  const handleSessionStart = (id, aiMessage) => {
    setSessionId(id);
    setInitialMessage(aiMessage);
    setPhase(PHASE.CHAT);
  };

  // Called by ChatWindow when status becomes "completed"
  const handleSessionComplete = async () => {
    setPhase(PHASE.SCORING);
    setError('');
    try {
      const res = await api.post('/api/interview/score', { sessionId });
      setScore(res.data.score);
      setPhase(PHASE.RESULT);
    } catch (err) {
      setError('Failed to retrieve your score. Please refresh and try again.');
      setPhase(PHASE.CHAT);
    }
  };

  const handleStartNew = () => {
    setPhase(PHASE.SELECT);
    setSessionId(null);
    setInitialMessage('');
    setScore(null);
    setError('');
  };

  return (
    <div className="interview-page">
      {phase === PHASE.SELECT && (
        <CategorySelector onSessionStart={handleSessionStart} />
      )}

      {phase === PHASE.CHAT && (
        <ChatWindow
          sessionId={sessionId}
          initialMessage={initialMessage}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {phase === PHASE.SCORING && (
        <div className="scoring-loading">
        <LoadingSpinner label="Evaluating your session..." showColdStartWarning={true} />
      </div>
      )}

      {phase === PHASE.RESULT && (
        <>
          <SessionResult score={score} />
          <button id="new-interview-btn" className="start-btn" onClick={handleStartNew}>
            Start New Interview
          </button>
        </>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default InterviewSession;
