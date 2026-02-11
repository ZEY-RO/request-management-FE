import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import useAuth from '../context/useAuth';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Navbar from '../components/Navbar';
import './RequestsPage.css';

export default function RequestsPage() {
  const { isAuthenticated, isGuest, user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
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
        priority: priorityFilter || undefined,
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
  }, [statusFilter, titleFilter, priorityFilter, page]);

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
    setPriorityFilter('');
    setPage(1);
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await requestService.delete(requestId);
      // Refresh the requests list
      fetchRequests();
    } catch {
      setError('Failed to delete request.');
    }
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
          <select
            className="requests-page__filter-select"
            value={priorityFilter}
            onChange={(e) => {
              setPage(1);
              setPriorityFilter(e.target.value);
            }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="requests-page__filter-btn">
            Search
          </button>
          {(statusFilter || titleFilter || priorityFilter) && (
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
              {requests.map((req) => {
                const isOwner = isAuthenticated && !isGuest && user?.id === req.user_id;
                return (
                  <div key={req.id} className="requests-page__card">
                    <Link to={`/requests/${req.id}`} className="requests-page__card-link">
                      <div className="requests-page__card-header">
                        <h3 className="requests-page__card-title">{req.title}</h3>
                        <div className="requests-page__badges">
                          <StatusBadge status={req.status} />
                          <PriorityBadge priority={req.priority} />
                        </div>
                      </div>
                      <div className="requests-page__card-meta">
                        <span>Author: {req.user?.email || 'Unknown'}</span>
                        <span>ID: #{req.id}</span>
                        <span>{formatDate(req.created_at)}</span>
                      </div>
                    </Link>
                    {isOwner && (
                      <div className="requests-page__card-actions">
                        <Link
                          to={`/requests/${req.id}/edit`}
                          className="requests-page__action-btn requests-page__action-btn--edit"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="requests-page__action-btn requests-page__action-btn--delete"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
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
