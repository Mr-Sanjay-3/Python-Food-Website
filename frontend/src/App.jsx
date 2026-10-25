import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/SubComponents/Navbar';
import Track from './components/Track';
import OrderFood from './components/OrderFood';
import Cart from './components/SubComponents/Cart';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orderfood" element={<OrderFood />} />
        <Route path="/track" element={<Track />} />
      </Routes>

      <Cart />
    </CartProvider>
  );
};

export default App;