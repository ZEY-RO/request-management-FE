import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
import Navbar from '../components/Navbar';
import './CreateRequestPage.css';

export default function CreateRequestPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await requestService.create({ title, description, status });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setStatus('pending');
      setTimeout(() => {
        navigate(`/requests`);
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(', ') || 'Failed to create request.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-page">
      <Navbar />

      <main className="create-page__main">
        <h1 className="create-page__title">New Request</h1>
        <p className="create-page__subtitle">
          Fill out the form below to submit a new request
        </p>

        {success && (
          <div className="create-page__success">
            Request created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-page__form">
          {error && <div className="create-page__error">{error}</div>}

          <div className="create-page__field">
            <label htmlFor="title" className="create-page__label">
              Title <span className="create-page__required">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="create-page__input"
              placeholder="A brief, descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="create-page__field">
            <label htmlFor="description" className="create-page__label">
              Description <span className="create-page__required">*</span>
            </label>
            <textarea
              id="description"
              className="create-page__textarea"
              placeholder="Describe your request in detail…"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="create-page__field">
            <label htmlFor="status" className="create-page__label">
              Status
            </label>
            <select
              id="status"
              className="create-page__select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="create-page__actions">
            <button
              type="submit"
              className="create-page__btn create-page__btn--submit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting…' : 'Submit Request'}
            </button>
            <button
              type="button"
              className="create-page__btn create-page__btn--cancel"
              onClick={() => navigate('/requests')}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
