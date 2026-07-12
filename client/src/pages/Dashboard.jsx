import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReadinessChart from '../components/Dashboard/ReadinessChart';
import SessionHistoryList from '../components/Dashboard/SessionHistoryList';
import AddProblemForm from '../components/Dashboard/AddProblemForm';
import ProblemLogList from '../components/Dashboard/ProblemLogList';
import PatternStatsChart from '../components/Dashboard/PatternStatsChart';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [problems, setProblems] = useState([]);
  const [patternStats, setPatternStats] = useState({});
  const [activeTab, setActiveTab] = useState('interviews'); // 'interviews' or 'dsa-log'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/dashboard/history'),
      ]);
      setStats(statsRes.data.stats);
      setHistory(historyRes.data.history);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    }
  };

  const fetchProblemsData = async () => {
    try {
      const [probsRes, statsRes] = await Promise.all([
        api.get('/api/problems'),
        api.get('/api/problems/stats'),
      ]);
      setProblems(probsRes.data);
      setPatternStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load problems data:', err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardData(), fetchProblemsData()]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  const handleProblemAdded = async () => {
    // Re-fetch problems list and stats after a new problem is logged
    await fetchProblemsData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner label="Loading your progress..." showColdStartWarning={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p className="error-text">{error}</p>
        <button className="start-btn" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const hasSessions = history && history.length > 0;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome back 👋</h1>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{currentUser?.email}</span>
      </header>

      <div className="dashboard-tabs">
        <button 
          id="tab-interviews"
          className={`dashboard-tab ${activeTab === 'interviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          Mock Interviews
        </button>
        <button 
          id="tab-dsa-log"
          className={`dashboard-tab ${activeTab === 'dsa-log' ? 'active' : ''}`}
          onClick={() => setActiveTab('dsa-log')}
        >
          DSA Practice Log
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'interviews' ? (
          <>
            {!hasSessions ? (
              <div className="empty-state">
                <h2>No sessions yet!</h2>
                <p>Start your first mock interview to see your readiness score and history here.</p>
                <button 
                  className="start-btn large-btn" 
                  onClick={() => navigate('/interview')}
                >
                  Start New Mock Interview
                </button>
              </div>
            ) : (
              <>
                <div className="dashboard-actions">
                  <button 
                    className="start-btn" 
                    onClick={() => navigate('/interview')}
                  >
                    Start New Mock Interview
                  </button>
                </div>
                
                <ReadinessChart stats={stats} />
                <SessionHistoryList history={history} />
              </>
            )}
          </>
        ) : (
          <div className="dsa-log-section">
            <div className="dsa-log-grid">
              <div className="dsa-log-left">
                <AddProblemForm onProblemAdded={handleProblemAdded} />
              </div>
              <div className="dsa-log-right">
                <PatternStatsChart stats={patternStats} />
              </div>
            </div>
            <ProblemLogList problems={problems} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
