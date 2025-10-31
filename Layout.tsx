
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PlusCircleIcon, CogIcon } from './Icons';
import AdBanner from './AdBanner';

const Layout: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex flex-col items-center justify-center flex-1 transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-blue-300 hover:text-white'
    }`;

  return (
    <>
      <header className="bg-blue-800 text-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-xl font-bold text-center">Gestione Veicoli</h1>
        </div>
      </header>

      <div className="mt-16"></div>

      <AdBanner />

      <nav className="fixed bottom-0 left-0 right-0 bg-blue-800 shadow-lg z-10">
        <div className="max-w-4xl mx-auto flex justify-around p-2">
          <NavLink to="/" className={navLinkClass}>
            <HomeIcon />
            <span className="text-xs font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/add-vehicle" className={navLinkClass}>
            <PlusCircleIcon />
            <span className="text-xs font-medium">Aggiungi</span>
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            <CogIcon />
            <span className="text-xs font-medium">Impostazioni</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Layout;
