import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a session already exists on boot
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('voluntree_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Fetch current user details from our dependency token route
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error("Session restoration failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // URL encoded payload matching OAuth2 standards used in FastAPI backend
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = response.data;
      localStorage.setItem('voluntree_token', access_token);

      // Fetch profile details immediately following successful authentication
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