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

const getScoreColor = (score) => {
  if (score >= 8) return '#22c55e'; // Green
  if (score >= 5) return '#f59e0b'; // Yellow
  return '#ef4444';                 // Red
};

const getScoreGlow = (score) => {
  if (score >= 8) return 'rgba(34, 197, 94, 0.25)';
  if (score >= 5) return 'rgba(245, 158, 11, 0.25)';
  return 'rgba(239, 68, 68, 0.25)';
};

const SessionResult = ({ score }) => {
  if (!score) return null;

  const overallScore = score.overallScore;
  const scoreColor = overallScore ? getScoreColor(overallScore) : '#6b7280';
  const scoreGlow = overallScore ? getScoreGlow(overallScore) : 'transparent';

  return (
    <div className="session-result">
      <h2>Interview Complete 🎉</h2>

      {/* Overall Score Headline */}
      {overallScore && (
        <div className="overall-score-display">
          <div
            className="overall-score-circle"
            style={{
              borderColor: scoreColor,
              boxShadow: `0 0 30px ${scoreGlow}, 0 0 60px ${scoreGlow}`,
            }}
          >
            <span className="overall-score-number" style={{ color: scoreColor }}>
              {overallScore}
            </span>
            <span className="overall-score-divider">/10</span>
          </div>
          <p className="overall-score-label">Overall Score</p>
        </div>
      )}

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
