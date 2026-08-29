import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('lustre_token');

        if (!token) {
          setLoading(false);
          return;
        }

        // Get current user from backend
        const response = await api.get('/auth/me');

        if (response.success) {
          setUser(response.user);
          setProfile(response.profile || null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);

        localStorage.removeItem('lustre_token');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const token = response.session?.access_token;

      if (token) {
        localStorage.setItem('lustre_token', token);
      }

      setUser(response.user);
      setProfile(response.profile || null);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('lustre_token');

    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};