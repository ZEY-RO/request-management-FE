import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Navbar from '../components/Navbar';
import './RequestsPage.css';

export default function RequestsPage() {
  const { isAuthenticated, isGuest } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [totalRequestsCount, setTotalRequestsCount] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await requestService.list({
        status: statusFilter || undefined,
        title: titleFilter || undefined,
        page,
        perPage,
      });
      setRequests(data.requests || []);
      setTotalRequestsCount(data.total_count || 0);
    } catch {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, titleFilter, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setTitleFilter('');
    setPage(1);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="requests-page">
      <Navbar />

      <main className="requests-page__main">
        <div className="requests-page__header">
          <div>
            <h1 className="requests-page__title">Requests</h1>
            <p className="requests-page__subtitle">
              Browse and manage all requests
            </p>
          </div>
          {isAuthenticated && !isGuest && (
            <Link to="/requests/new" className="requests-page__create-btn">
              + New Request
            </Link>
          )}
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="requests-page__filters">
          <input
            type="text"
            placeholder="Search by title…"
            className="requests-page__filter-input"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
          <select
            className="requests-page__filter-select"
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button type="submit" className="requests-page__filter-btn">
            Search
          </button>
          {(statusFilter || titleFilter) && (
            <button
              type="button"
              className="requests-page__filter-clear"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          )}
        </form>

        {/* Content */}
        {loading ? (
          <div className="requests-page__loading">
            <div className="requests-page__spinner" />
            Loading requests…
          </div>
        ) : error ? (
          <div className="requests-page__error">{error}</div>
        ) : requests.length === 0 ? (
          <div className="requests-page__empty">
            <p>No requests found.</p>
            {isAuthenticated && !isGuest && (
              <Link to="/requests/new" className="requests-page__empty-btn">
                Create your first request
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="requests-page__list">
              {requests.map((req) => (
                <Link
                  key={req.id}
                  to={`/requests/${req.id}`}
                  className="requests-page__card"
                >
                  <div className="requests-page__card-header">
                    <h3 className="requests-page__card-title">{req.title}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="requests-page__card-meta">
                    <span>ID: #{req.id}</span>
                    <span>{formatDate(req.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="requests-page__pagination">
              <button
                className="requests-page__page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </button>
              <span className="requests-page__page-info">Page {page}</span>
              <button
                className="requests-page__page-btn"
                disabled={requests.length < perPage || page * perPage >= totalRequestsCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
