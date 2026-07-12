import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">🎯 MockIQ</span>
      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/interview"
          className={`navbar-link ${location.pathname === '/interview' ? 'active' : ''}`}
        >
          New Interview
        </Link>
      </div>
      <div className="navbar-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
