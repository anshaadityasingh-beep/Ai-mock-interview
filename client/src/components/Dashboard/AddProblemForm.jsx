import { useState } from 'react';
import api from '../../services/api';

const PATTERNS = [
  'two pointers',
  'sliding window',
  'binary search',
  'hashmap',
  'linked list',
  'stack',
  'math',
  'string',
  'array'
];

const AddProblemForm = ({ onProblemAdded }) => {
  const [title, setTitle] = useState('');
  const [pattern, setPattern] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !pattern || !difficulty) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/api/problems', {
        title,
        pattern,
        difficulty,
        notes
      });
      setSuccess('Problem logged successfully!');
      setTitle('');
      setPattern('');
      setDifficulty('medium');
      setNotes('');
      if (onProblemAdded) {
        onProblemAdded(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to log problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-problem-form-container">
      <h3>Log Solved DSA Problem</h3>
      <form onSubmit={handleSubmit} className="add-problem-form">
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        
        <div className="form-group">
          <label htmlFor="problem-title">Problem Title *</label>
          <input
            id="problem-title"
            type="text"
            placeholder="e.g., Two Sum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="problem-pattern">Pattern *</label>
            <select
              id="problem-pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              required
            >
              <option value="">-- Select Pattern --</option>
              {PATTERNS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="problem-difficulty">Difficulty *</label>
            <select
              id="problem-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="problem-notes">Notes (Optional)</label>
          <textarea
            id="problem-notes"
            placeholder="Approach, edge cases, time/space complexity, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <button 
          id="log-problem-btn" 
          type="submit" 
          className="start-btn" 
          disabled={loading}
        >
          {loading ? 'Logging...' : 'Log Problem'}
        </button>
      </form>
    </div>
  );
};

export default AddProblemForm;
