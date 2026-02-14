import React from 'react';
import Link from 'next/link';
import { PageId } from '../types';

interface NavbarProps {
  onNavigate: (page: PageId) => void;
  currentPage: PageId;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-indigo-600">SME</span>Connect
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-lg font-medium transition-colors ${currentPage === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('marketplace')}
              className={`text-lg font-medium transition-colors ${currentPage === 'marketplace' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => onNavigate('providers')}
              className={`text-lg font-medium transition-colors ${currentPage === 'providers' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Providers
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link href="/signup" className="text-lg font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Sign up
            </Link>
            <Link href="/login" className="text-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-lg transition-all">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;