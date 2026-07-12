const BADGE_COLORS = {
  // approachCorrectness
  correct: '#22c55e',
  partially_correct: '#f59e0b',
  incorrect: '#ef4444',
  // depthOfUnderstanding
  strong: '#22c55e',
  moderate: '#f59e0b',
  weak: '#ef4444',
  // communicationClarity
  clear: '#22c55e',
  somewhat_clear: '#f59e0b',
  unclear: '#ef4444',
};

const Badge = ({ value }) => {
  const color = BADGE_COLORS[value] || '#6b7280';
  const label = value.replace(/_/g, ' ');
  return (
    <span className="score-badge" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
};

const SessionResult = ({ score }) => {
  if (!score) return null;

  return (
    <div className="session-result">
      <h2>Interview Complete 🎉</h2>
      <p className="result-feedback">"{score.oneLineFeedback}"</p>

      <div className="score-cards">
        <div className="score-card">
          <span className="score-label">Approach Correctness</span>
          <Badge value={score.approachCorrectness} />
        </div>
        <div className="score-card">
          <span className="score-label">Depth of Understanding</span>
          <Badge value={score.depthOfUnderstanding} />
        </div>
        <div className="score-card">
          <span className="score-label">Communication Clarity</span>
          <Badge value={score.communicationClarity} />
        </div>
        <div className="score-card">
          <span className="score-label">Needed Hints</span>
          <Badge value={score.neededHints ? 'incorrect' : 'correct'} />
          <span className="hint-label">{score.neededHints ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionResult;
