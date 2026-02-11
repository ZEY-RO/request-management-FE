import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import AuthContext from './authContext';

export function AuthProvider({ children }) {
  const safeGetItem = useCallback((key) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, []);

  const safeSetItem = useCallback((key, value) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(key, value);
    } catch {
      // ignore storage errors (e.g., private mode)
    }
  }, []);

  const [token, setToken] = useState(() => safeGetItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = safeGetItem('user');
    if (!savedUser) {
      return null;
    }
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const saveSession = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    safeSetItem('token', jwtToken);
    safeSetItem('user', JSON.stringify(userData));
  }, [safeSetItem]);

  const login = useCallback(async ({ email, password }) => {
    const { user: userData, token: jwtToken } = await authService.login({ email, password });
    saveSession(userData, jwtToken);
    return userData;
  }, [saveSession]);

  const signup = useCallback(async ({ email, password, passwordConfirmation }) => {
    await authService.signup({ email, password, passwordConfirmation });
    // Auto-login after signup
    return login({ email, password });
  }, [login]);

  const guestLogin = useCallback(async () => {
    const { user: userData, token: guestToken } = await authService.guestLogin();
    saveSession(userData, guestToken);
    return userData;
  }, [saveSession]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = !!token;
  const isGuest = user?.email === 'guest@example.com';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isGuest,
    login,
    signup,
    guestLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
