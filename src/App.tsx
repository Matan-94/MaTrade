import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { useThemeStore } from './store/theme';
import { SplashScreen } from './components/ui/SplashScreen';
import { initializeBinanceWebSocket } from './lib/api/binance';
import { useAuthStore } from './store/auth';
import { AuthRedirect } from './components/AuthRedirect';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Trade = React.lazy(() => import('./pages/Trade'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Statistics = React.lazy(() => import('./pages/Statistics'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const About = React.lazy(() => import('./pages/About'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { theme } = useThemeStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const cleanup = initializeBinanceWebSocket();
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => {
      cleanup();
      clearTimeout(timer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
        <Header />
        <main className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400" />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route element={<AuthRedirect />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/trade" element={
                <ProtectedRoute>
                  <Trade />
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </Router>
  );
}