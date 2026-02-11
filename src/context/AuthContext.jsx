import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveSession = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
