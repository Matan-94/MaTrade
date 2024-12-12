import  { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BACKEND_URL } from '../../config';
import {
  BarChart2,
  LogOut,
  Menu,
  PieChart,
  TrendingUp,
  Info,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/Button';

export const navigation = [
  { name: 'Home', href: '/', icon: Home, public: true },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Trade', href: '/trade', icon: TrendingUp },
  { name: 'Statistics', href: '/statistics', icon: BarChart2 },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'About', href: '/about', icon: Info, public: true },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavigation = isAuthenticated
  ? navigation.filter((item) => !item.public) // Show only authenticated routes
  : navigation.filter((item) => item.public); // Show only public routes

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            <nav className="hidden md:flex space-x-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                      } relative group`}
                  >
                    <item.icon className={`h-4 w-4 mr-2 ${isActive ? 'text-black' : ''}`} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-4">
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-black font-bold">
                      {user?.avatar ? (
  <img
    src={`${BACKEND_URL}${user.avatar}`}
    alt="Profile"
    className="w-full h-full object-cover"
  />
) : (
  <span className="text-black">{user?.name?.charAt(0).toUpperCase()}</span>
)}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {user?.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.button>

                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="hidden md:flex"
                >
                  Login
                </Button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
}