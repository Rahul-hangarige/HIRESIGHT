import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronizes the Bearer token with local storage and axios headers
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/profile');
          if (res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            setToken(null);
          }
        } catch (error) {
          console.warn('Session verification failed, logging out.');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.error || 'Authentication failed');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Server error';
      throw new Error(msg);
    }
  };

  const register = async (name, email, password, organization) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, organization });
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.error || 'Registration failed');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Server error';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfileDetails = async (name, organization, password) => {
    try {
      const payload = { name, organization };
      if (password) {
        payload.password = password;
      }
      const res = await axios.put('/api/profile', payload);
      if (res.data && res.data.success) {
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.error || 'Update failed');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Server error';
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile: updateProfileDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
