const ProblemLogList = ({ problems }) => {
  if (!problems || problems.length === 0) {
    return <p className="empty-logs-text">No manual DSA problems logged yet.</p>;
  }

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="problem-log-list-container">
      <h3>Problem Log History</h3>
      <div className="problem-list-scroll">
        <ul className="problem-list">
          {problems.map((prob) => (
            <li key={prob._id} className="problem-item">
              <div className="problem-item-main">
                <span className="problem-title">{prob.title}</span>
                <span className="problem-pattern-tag">{prob.pattern}</span>
              </div>
              <div className="problem-item-meta">
                <span 
                  className="diff-badge" 
                  style={{ color: getDifficultyColor(prob.difficulty), borderColor: getDifficultyColor(prob.difficulty) }}
                >
                  {prob.difficulty}
                </span>
                <span className="solved-date">
                  {new Date(prob.solvedAt).toLocaleDateString()}
                </span>
              </div>
              {prob.notes && (
                <div className="problem-item-notes">
                  <strong>Notes:</strong> {prob.notes}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemLogList;
