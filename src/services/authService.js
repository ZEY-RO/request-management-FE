import api from './api';

export const authService = {
  /**
   * Sign up a new user.
   * POST /users
   */
  async signup({ email, password, passwordConfirmation }) {
    const response = await api.post('/users', {
      user: { email, password, password_confirmation: passwordConfirmation },
    });
    return response.data;
  },

  /**
   * Log in an existing user.
   * POST /users/sign_in
   * JWT token is returned in the Authorization header.
   */
  async login({ email, password }) {
    const response = await api.post('/users/sign_in', {
      user: { email, password },
    });

    // Extract JWT from Authorization header
    const authHeader = response.headers['authorization'] || response.headers['Authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : response.data.user.auth_token;

    return {
      user: response.data.user,
      token,
    };
  },

  /**
   * Guest login — returns a reusable guest user and token.
   * POST /users/guest
   */
  async guestLogin() {
    const response = await api.post('/auth/guest');
    return {
      user: response.data.user,
    };
  },

  /**
   * Log out the current user.
   * DELETE /users/sign_out
   */
  async logout() {
    try {
      await api.delete('/users/sign_out');
    } catch {
      // Even if the server request fails, we clear local state
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
