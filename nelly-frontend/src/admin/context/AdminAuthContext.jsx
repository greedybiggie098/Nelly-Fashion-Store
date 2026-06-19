import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [user, isAuthenticated, loading]);

  const requireAdmin = () => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/');
      return false;
    }
    return true;
  };

  const value = {
    isAdmin,
    user,
    loading,
    requireAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
