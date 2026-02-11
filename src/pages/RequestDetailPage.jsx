import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import useAuth from '../context/useAuth';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Navbar from '../components/Navbar';
import './RequestDetailPage.css';

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isOwner = isAuthenticated && !isGuest && user?.id === request?.user_id;

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await requestService.get(id);
        setRequest(data.request);
      } catch {
        setError('Request not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    setDeleting(true);
    try {
      await requestService.delete(id);
      navigate('/requests');
    } catch {
      setError('Failed to delete request.');
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="detail-page">
      <Navbar />

      <main className="detail-page__main">
        <Link to="/requests" className="detail-page__back">
          ← Back to Requests
        </Link>

        {loading ? (
          <div className="detail-page__loading">
            <div className="detail-page__spinner" />
            Loading…
          </div>
        ) : error && !request ? (
          <div className="detail-page__error">{error}</div>
        ) : request ? (
          <div className="detail-page__card">
            {error && <div className="detail-page__error-inline">{error}</div>}
            <>
              <div className="detail-page__header">
                <h1 className="detail-page__title">{request.title}</h1>
                <div className="detail-page__badges">
                  <StatusBadge status={request.status} />
                  <PriorityBadge priority={request.priority} />
                </div>
              </div>

              <p className="detail-page__description">{request.description}</p>

              <div className="detail-page__meta">
                <div className="detail-page__meta-item">
                  <span className="detail-page__meta-label">Created</span>
                  <span>{formatDate(request.created_at)}</span>
                </div>
                <div className="detail-page__meta-item">
                  <span className="detail-page__meta-label">Author</span>
                  <span>{request.user?.email || 'Unknown'}</span>
                </div>
                <div className="detail-page__meta-item">
                  <span className="detail-page__meta-label">Updated</span>
                  <span>{formatDate(request.updated_at)}</span>
                </div>
                <div className="detail-page__meta-item">
                  <span className="detail-page__meta-label">ID</span>
                  <span>#{request.id}</span>
                </div>
              </div>

              {isOwner && (
                <div className="detail-page__actions">
                  <Link
                    className="detail-page__btn detail-page__btn--edit"
                    to={`/requests/${request.id}/edit`}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    className="detail-page__btn detail-page__btn--delete"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting…' : '🗑️ Delete'}
                  </button>
                </div>
              )}
            </>
          </div>
        ) : null}
      </main>
    </div>
  );
}
