import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Navbar from '../components/Navbar';
import './RequestDetailPage.css';

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', status: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = isAuthenticated && !isGuest && user?.id === request?.user_id;

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await requestService.get(id);
        setRequest(data.request);
        setEditData({
          title: data.request.title,
          description: data.request.description,
          status: data.request.status,
        });
      } catch {
        setError('Request not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await requestService.update(id, editData);
      setRequest(data.request);
      setIsEditing(false);
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(', ') || 'Failed to update request.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

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

            {isEditing ? (
              /* Edit mode */
              <div className="detail-page__edit">
                <div className="detail-page__field">
                  <label className="detail-page__label">Title</label>
                  <input
                    className="detail-page__input"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                </div>

                <div className="detail-page__field">
                  <label className="detail-page__label">Description</label>
                  <textarea
                    className="detail-page__textarea"
                    rows={5}
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                  />
                </div>

                <div className="detail-page__field">
                  <label className="detail-page__label">Status</label>
                  <select
                    className="detail-page__select"
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="detail-page__actions">
                  <button
                    className="detail-page__btn detail-page__btn--save"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    className="detail-page__btn detail-page__btn--cancel"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        title: request.title,
                        description: request.description,
                        status: request.status,
                      });
                      setError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <>
                <div className="detail-page__header">
                  <h1 className="detail-page__title">{request.title}</h1>
                  <StatusBadge status={request.status} />
                </div>

                <p className="detail-page__description">{request.description}</p>

                <div className="detail-page__meta">
                  <div className="detail-page__meta-item">
                    <span className="detail-page__meta-label">Created</span>
                    <span>{formatDate(request.created_at)}</span>
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
                    <button
                      className="detail-page__btn detail-page__btn--edit"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit
                    </button>
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
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
