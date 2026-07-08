import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read session token and pull explicit profile record on boot
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('voluntree_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get('/auth/me');
        // Extract user data from response payload
        setUser(response.data);
      } catch (error) {
        console.error("Session profile sync failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
      });

      const { access_token } = response.data;
      localStorage.setItem('voluntree_token', access_token);

      // Fetch user details immediately to load correct role configuration
      const userProfile = await apiClient.get('/auth/me');
      setUser(userProfile.data);
      return userProfile.data;
    } catch (error) {
      throw error.response?.data?.detail || "Authentication failed";
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('voluntree_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be executed within an AuthProvider scope");
  }
  return context;
};
