import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodweb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodweb_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product) return;
    setCartItems((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.imageuri || product.img || '',
        category: product.category,
      },
    ]);
  };

  const handleIncrease = (item) => {
    if (!item) return;
    setCartItems((prev) => [
      ...prev,
      {
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img || item.imageuri || '',
        category: item.category,
      },
    ]);
  };

  const handleDecrease = (item) => {
    if (!item) return;
    setCartItems((prev) => {
      const index = prev.findIndex((p) => p.id === item.id);
      if (index !== -1) {
        const copy = [...prev];
        copy.splice(index, 1);
        return copy;
      }
      return prev;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((p) => p.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        handleIncrease,
        handleDecrease,
        removeFromCart,
        clearCart,
        isOpen,
        setIsOpen,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
