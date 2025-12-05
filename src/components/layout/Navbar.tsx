'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import { Coins, User } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = forwardRef<HTMLElement, NavbarProps>(({ onLoginClick }, ref) => {
  const { user } = useAuth();

  return (
    <nav ref={ref} className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-gray-800/50 opacity-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-gray-900 dark:text-white">
          <span className="text-orange-500">Pickabook</span>Magic
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-5 dark:bg-orange-900/30 rounded-full border border-orange-200 dark:border-orange-700">
                <Coins className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">{user.credits}</span>
              </div>
              {user.userType === 2 && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="w-9 h-9 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30"
              >
                <User className="w-4 h-4 text-white" />
              </Link>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
