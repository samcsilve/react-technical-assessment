import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from API if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Use local storage for non-authenticated users
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to local storage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const response = await addToCart(product.id, quantity);
        if (response.data.success) {
          await fetchCart();
        }
      } else {
        // Local cart management
        const existingItem = cartItems.find(item => item.productId === product.id);
        let newItems;
        if (existingItem) {
          newItems = cartItems.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...cartItems, {
            id: Date.now().toString(),
            productId: product.id,
            product: product,
            quantity: quantity
          }];
        }
        setCartItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local cart
      const existingItem = cartItems.find(item => item.productId === product.id);
      let newItems;
      if (existingItem) {
        newItems = cartItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...cartItems, {
          id: Date.now().toString(),
          productId: product.id,
          product: product,
          quantity: quantity
        }];
      }
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        const response = await updateCartItem(itemId, quantity);
        if (response.data.success) {
          await fetchCart();
        }
      } else {
        const newItems = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0);
        setCartItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      // Fallback to local cart
      const newItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (isAuthenticated) {
        const response = await removeFromCart(itemId);
        if (response.data.success) {
          await fetchCart();
        }
      } else {
        const newItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local cart
      const newItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addItem,
      updateItem,
      removeItem,
      getCartCount,
      getCartTotal,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

