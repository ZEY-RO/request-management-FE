import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import useAuth from '../context/useAuth';
import Navbar from '../components/Navbar';
import RequestForm from '../components/RequestForm';
import './RequestDetailPage.css';
import '../components/RequestForm.css';

export default function EditRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      } catch {
        setError('Request not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, isAuthenticated, isGuest, navigate, user?.id]);

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
              <RequestForm
                initialData={request}
                onSubmit={async (data) => {
                  setSaving(true);
                  try {
                    const result = await requestService.update(id, data);
                    navigate(`/requests/${result.request.id}`);
                  } catch (err) {
                    const message =
                      err.response?.data?.errors?.join(', ') || 'Failed to update request.';
                    setError(message);
                  } finally {
                    setSaving(false);
                  }
                }}
                submitButtonText="Save Changes"
                isLoading={saving}
                error={error}
                onCancel={() => navigate(`/requests/${id}`)}
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
