import { createContext, useState, useContext, useEffect } from 'react';
import { accountAPI } from '../services/accountApi';
import toast from '../utils/toast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getWishlist();
      if (response.data.success) {
        setWishlist(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await accountAPI.addToWishlist(productId);
      if (response.data.success) {
        toast.success('Added to wishlist!');
        fetchWishlist();
        return true;
      } else {
        toast.info(response.data.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await accountAPI.removeFromWishlist(productId);
      if (response.data.success) {
        toast.success('Removed from wishlist');
        fetchWishlist();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    wishlistCount: wishlist.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
