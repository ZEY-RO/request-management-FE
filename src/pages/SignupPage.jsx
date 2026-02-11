import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({ email, password, passwordConfirmation });
      navigate('/requests');
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.error ||
        'Signup failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup__card">
        <div className="signup__header">
          <span className="signup__logo">📋</span>
          <h1 className="signup__title">Create Account</h1>
          <p className="signup__subtitle">
            Join Request Manager to start creating and tracking requests
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup__form">
          {error && <div className="signup__error">{error}</div>}

          <div className="signup__field">
            <label htmlFor="email" className="signup__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="signup__input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="signup__field">
            <label htmlFor="password" className="signup__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="signup__input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="signup__field">
            <label htmlFor="passwordConfirmation" className="signup__label">
              Confirm Password
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              className="signup__input"
              placeholder="Repeat your password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="signup__btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="signup__footer">
          Already have an account?{' '}
          <Link to="/" className="signup__link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
