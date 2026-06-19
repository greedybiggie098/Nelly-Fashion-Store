import { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from '../utils/toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      if (response.data.success) {
        setCartItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, size, color, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    try {
      const response = await cartAPI.add({
        product_id: product.id,
        quantity,
        size,
        color,
      });

      if (response.data.success) {
        await fetchCart();
        toast.success('Item added to cart!');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error('Failed to add item to cart');
      return { success: false };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await cartAPI.update({
        item_id: itemId,
        quantity,
      });

      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error('Failed to update cart');
      return { success: false };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.remove(itemId);
      if (response.data.success) {
        await fetchCart();
        toast.success('Item removed from cart');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error('Failed to remove item');
      return { success: false };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.item_total, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
