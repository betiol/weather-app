import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ChevronDown } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userEmail, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <motion.div className="w-full px-4 py-4">
        <motion.div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div className="flex items-center gap-4">
            <Logo size="md" />
          </motion.div>

          <motion.div className="relative">
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
            >
              <motion.div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName || userEmail?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </motion.div>

              <motion.div className="flex items-center gap-2">
                <motion.div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                    {(userName || userEmail || 'U')[0].toUpperCase()}
                  </span>
                </motion.div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </motion.div>
            </motion.button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1"
                >
                  <motion.div className="sm:hidden px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userName || userEmail?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userEmail}
                    </p>
                  </motion.div>
                  
                  <motion.button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </motion.div>
              )}

            {dropdownOpen && (
              <motion.div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setDropdownOpen(false)}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;