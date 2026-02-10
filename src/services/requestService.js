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

};
