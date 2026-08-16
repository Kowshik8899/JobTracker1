import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('jobtracker_token');
      
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          // Assuming backend is at https://jobtracker-backend-4mt6.onrender.com or relative path if proxied
          const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
          const { data } = await axios.get(`${backendUrl}/api/auth/profile`, config);
          
          setUser({ ...data, token });
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('jobtracker_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
    const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    localStorage.setItem('jobtracker_token', data.token);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
    const { data } = await axios.post(`${backendUrl}/api/auth/register`, userData);
    localStorage.setItem('jobtracker_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('jobtracker_token');
    setUser(null);
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
