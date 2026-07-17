import React, { useState } from 'react';

const getScoreColor = (score) => {
  if (score >= 8) return '#22c55e'; // Green
  if (score >= 5) return '#f59e0b'; // Yellow
  return '#ef4444';                 // Red
};

const SessionHistoryList = ({ history }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!history || history.length === 0) return null;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="session-history">
      <h3>Past Sessions</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Question</th>
            <th>Score</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {history.map((session) => (
            <React.Fragment key={session._id}>
              <tr 
                className="history-row" 
                onClick={() => toggleExpand(session._id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{new Date(session.completedAt).toLocaleDateString()}</td>
                <td><span className="cat-badge">{session.category}</span></td>
                <td className="truncate" title={session.question}>{session.question}</td>
                <td>
                  {session.score?.overallScore ? (
                    <span 
                      className="history-score-badge"
                      style={{ 
                        color: getScoreColor(session.score.overallScore),
                        borderColor: getScoreColor(session.score.overallScore),
                        backgroundColor: `${getScoreColor(session.score.overallScore)}15`,
                      }}
                    >
                      {session.score.overallScore}/10
                    </span>
                  ) : (
                    <span className="history-score-badge" style={{ color: '#6b7280', borderColor: '#6b7280' }}>
                      —
                    </span>
                  )}
                </td>
                <td>
                  {session.score?.approachCorrectness === 'correct' && session.score?.depthOfUnderstanding === 'strong' 
                    ? '✅ Strong' 
                    : '⚠️ Needs Review'}
                </td>
              </tr>
              {expandedId === session._id && (
                <tr className="history-expanded-row">
                  <td colSpan="5">
                    <div className="feedback-box">
                      <strong>Feedback:</strong> {session.score?.oneLineFeedback || 'No feedback available.'}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistoryList;
