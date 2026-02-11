import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/requests" className="navbar__brand">
          <span className="navbar__icon">📋</span>
          Request Manager
        </Link>

        <div className="navbar__links">
          <Link to="/requests" className="navbar__link">
            All Requests
          </Link>
          {isAuthenticated && !isGuest && (
            <Link to="/requests/new" className="navbar__link">
              + New Request
            </Link>
          )}
        </div>

        <div className="navbar__user">
          {isAuthenticated ? (
            <>
              <span className="navbar__email">
                {isGuest ? '👤 Guest' : user?.email}
              </span>
              <button onClick={handleLogout} className="navbar__btn navbar__btn--logout">
                Log Out
              </button>
            </>
          ) : (
            <Link to="/" className="navbar__btn navbar__btn--login">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
