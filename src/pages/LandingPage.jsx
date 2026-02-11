import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import './LandingPage.css';

export default function LandingPage() {
  const { login, guestLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/requests', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password });
      navigate('/requests');
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.errors?.join(', ') ||
        'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsGuestLoading(true);

    try {
      await guestLogin();
      navigate('/requests');
    } catch {
      setError('Unable to log in as guest. Please try again.');
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="landing">
      <div className="landing__card">
        <div className="landing__header">
          <span className="landing__logo">📋</span>
          <h1 className="landing__title">Request Manager</h1>
          <p className="landing__subtitle">
            Create, track, and manage requests with ease
          </p>
        </div>

        <form onSubmit={handleLogin} className="landing__form">
          {error && <div className="landing__error">{error}</div>}

          <div className="landing__field">
            <label htmlFor="email" className="landing__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="landing__input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="landing__field">
            <label htmlFor="password" className="landing__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="landing__input"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="landing__btn landing__btn--primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="landing__divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGuestLogin}
          className="landing__btn landing__btn--guest"
          disabled={isGuestLoading}
        >
          {isGuestLoading ? 'Connecting…' : 'Continue as Guest'}
        </button>

        <p className="landing__footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="landing__link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
