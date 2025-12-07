import { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const loading = false;

  const register = async (data) => {
    const response = await authAPI.register(data);
    console.log('Register response:', response.data);
    
    const { token, ...userData } = response.data;
    
    if (!token) {
      console.error('No token received from registration endpoint!');
      throw new Error('Authentication token not received');
    }
    
    console.log('Storing token:', token.substring(0, 20) + '...');
    console.log('User data:', userData);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const login = async (data) => {
    const response = await authAPI.login(data);
    console.log('Login response:', response.data);
    
    const { token, ...userData } = response.data;
    
    if (!token) {
      console.error('No token received from login endpoint!');
      throw new Error('Authentication token not received');
    }
    
    console.log('Storing token:', token.substring(0, 20) + '...');
    console.log('User data:', userData);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
