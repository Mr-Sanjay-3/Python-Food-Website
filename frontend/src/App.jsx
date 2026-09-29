import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/SubComponents/Navbar';
import Track from './components/Track';
import OrderFood from './components/OrderFood';

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orderfood" element={<OrderFood />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </>
  );
};

export default App;