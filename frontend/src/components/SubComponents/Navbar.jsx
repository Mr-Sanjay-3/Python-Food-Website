import React from 'react';
import Logo from '../../assets/images/Logo.png';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-[#0D0D0D]/90 backdrop-blur-md px-8 py-4 sticky top-0 z-50 w-full border-b border-white/10 pointer-events-auto">
      <div>
        <img src={Logo} alt="FoodWeb Logo" />
      </div>
      <div className="flex items-center space-x-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-bold transition-colors' : 'text-cyan-50 hover:text-white transition-colors'
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/orderfood"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-bold transition-colors' : 'text-cyan-50 hover:text-white transition-colors'
          }
        >
          Order Food
        </NavLink>

        <NavLink
          to="/track"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-bold transition-colors' : 'text-cyan-50 hover:text-white transition-colors'
          }
        >
          Track Food
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;