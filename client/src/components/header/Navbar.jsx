// components/header/NavBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Newspaper, Briefcase, Target, MessageSquare } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: <Home size={18} /> },
  { to: '/news', label: 'News', icon: <Newspaper size={18} /> },
  { to: '/jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
  { to: '/trending', label: 'Trending', icon: <Target size={18} /> },
  { to: '/connect', label: 'Connect', icon: <MessageSquare size={18} /> },
];

const NavBar = () => {
  return (
    <nav className="bg-green-600 text-white z-50">
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-green-600 border-t border-green-500 flex justify-around py-2 text-xs shadow-md">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 ${
                isActive ? 'text-white font-semibold' : 'text-green-200'
              }`
            }
          >
            {icon}
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Desktop Horizontal Nav */}
      <div className="hidden md:flex justify-center items-center gap-6 py-2 text-sm font-medium">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1 hover:underline ${isActive ? 'font-semibold' : ''}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
