import api from './api';

export const requestService = {
  /**
   * List requests with optional filters.
   * GET /requests?status=...&title=...&page=...&per_page=...
   */
  async list({ status, title, page = 1, perPage = 25 } = {}) {
    const params = { page, per_page: perPage };
    if (status) params.status = status;
    if (title) params.title = title;

    const response = await api.get('/requests', { params });
    return response.data;
  },

  /**
   * Get a single request by ID.
   * GET /requests/:id
   */
  async get(id) {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  /**
   * Create a new request (authenticated).
   * POST /requests
   */
  async create({ title, description, status = 'pending' }) {
    const response = await api.post('/requests', {
      request: { title, description, status },
    });
    return response.data;
  },

  /**
   * Update a request (authenticated, owner only).
   * PATCH /requests/:id
   */
  async update(id, updates) {
    const response = await api.patch(`/requests/${id}`, {
      request: updates,
    });
    return response.data;
  },

  /**
   * Delete a request (authenticated, owner only).
   * DELETE /requests/:id
   */
  async delete(id) {
    await api.delete(`/requests/${id}`);
  },
};
