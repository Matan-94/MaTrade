import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigation } from './Header';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, isAuthenticated, onLogout }: MobileMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNavigation = isAuthenticated
  ? navigation.filter((item) => !item.public) // Show only authenticated routes
  : navigation.filter((item) => item.public); // Show only public routes

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-black border-r border-gray-200 dark:border-yellow-500/10 z-50 shadow-2xl shadow-black/5 dark:shadow-yellow-500/5"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200 dark:border-yellow-500/10">
                <div className="flex items-center justify-between">
                  <Logo />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-500 dark:text-yellow-500 hover:bg-gray-100 dark:hover:bg-yellow-500/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <motion.nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-2">
                  {filteredNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Link
                          to={item.href}
                          onClick={onClose}
                          className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-medium shadow-lg shadow-yellow-500/20'
                              : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                          }`}
                        >
                          <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-black' : ''}`} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.nav>

              <div className="p-6 border-t border-gray-200 dark:border-yellow-500/10">
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    variant="destructive"
                    className="w-full"
                    icon={<LogOut className="w-5 h-5" />}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/login');
                      onClose();
                    }}
                    className="w-full"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}