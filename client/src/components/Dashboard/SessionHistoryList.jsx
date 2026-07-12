import React, { useState } from 'react';

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
                  {session.score?.approachCorrectness === 'correct' && session.score?.depthOfUnderstanding === 'strong' 
                    ? '✅ Strong' 
                    : '⚠️ Needs Review'}
                </td>
              </tr>
              {expandedId === session._id && (
                <tr className="history-expanded-row">
                  <td colSpan="4">
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

// Assuming React is in scope for JSX, but for React.Fragment we need to import it if we use React.Fragment.
// A better way is just importing React or using empty tags. Let's fix that.
// I will rewrite without React.Fragment explicit reference or with import React.
export default SessionHistoryList;
