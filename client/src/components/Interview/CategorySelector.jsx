import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CATEGORIES = ['DSA', 'OS', 'DBMS', 'CN', 'OOP'];

const CategorySelector = ({ onSessionStart }) => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!selected) {
      setError('Please select a category to begin.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/interview/start', { category: selected });
      onSessionStart(res.data.sessionId, res.data.aiMessage, selected);
    } catch (err) {
      setError('Failed to start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-selector">
      <h2>Choose Your Interview Topic</h2>
      <p>Select a category and the AI will conduct a technical interview session with you.</p>
      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`category-${cat.toLowerCase()}`}
            className={`category-btn ${selected === cat ? 'selected' : ''}`}
            onClick={() => setSelected(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {error && <p className="error-text">{error}</p>}
      <button
        id="start-interview-btn"
        className="start-btn"
        onClick={handleStart}
        disabled={loading || !selected}
      >
        {loading ? 'Starting...' : 'Start Interview'}
      </button>
    </div>
  );
};

export default CategorySelector;
