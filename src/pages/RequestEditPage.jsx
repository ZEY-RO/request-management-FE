import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import useAuth from '../context/useAuth';
import Navbar from '../components/Navbar';
import './RequestDetailPage.css';

export default function RequestEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({ title: '', description: '', status: '', priority: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await requestService.get(id);

        if (!isAuthenticated || isGuest || user?.id !== data.request.user_id) {
          navigate(`/requests/${id}`, { replace: true });
          return;
        }

        setRequest(data.request);
        setEditData({
          title: data.request.title,
          description: data.request.description,
          status: data.request.status,
          priority: data.request.priority,
        });
      } catch {
        setError('Request not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, isAuthenticated, isGuest, navigate, user?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await requestService.update(id, editData);
      navigate(`/requests/${data.request.id}`);
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(', ') || 'Failed to update request.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="detail-page">
      <Navbar />

      <main className="detail-page__main">
        <Link to={`/requests/${id}`} className="detail-page__back">
          ← Back to Request
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
                <label className="detail-page__label">Priority</label>
                <select
                  className="detail-page__select"
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
                  onClick={() => navigate(`/requests/${id}`)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
