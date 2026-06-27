import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Eye
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', href: '/analyze', icon: FileText },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'HS';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-dark-text-primary transition-colors duration-200 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-dark-card border-r border-neutral-200 dark:border-dark-border fixed h-screen z-10">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-dark-border">
          <Link to="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg font-display shadow-md shadow-primary-500/20">
              H
            </div>
            <span className="font-extrabold text-xl tracking-tight font-display bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              HireSight
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 hover:text-neutral-950 dark:hover:text-neutral-200'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-dark-border bg-neutral-50/50 dark:bg-neutral-900/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm border border-primary-200/50 dark:border-primary-800/30">
                {getInitials(user?.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate leading-tight">{user?.name || 'Recruiter'}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate leading-none mt-1">{user?.organization || 'Organization'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={toggleTheme}
              className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 dark:border-dark-border flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 dark:border-dark-border flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col w-full min-h-screen">
        <header className="h-16 bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border px-4 flex items-center justify-between sticky top-0 z-20">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-7.5 h-7.5 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-md font-display">
              H
            </div>
            <span className="font-bold text-lg tracking-tight font-display bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              HireSight
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-neutral-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 flex md:hidden">
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-dark-card border-r border-neutral-200 dark:border-dark-border h-full p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-7.5 h-7.5 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-md font-display">
                    H
                  </div>
                  <span className="font-bold text-lg font-display">HireSight</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                          : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-neutral-200 dark:border-dark-border pt-4 mt-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold truncate leading-tight">{user?.name}</p>
                    <p className="text-xs text-neutral-400 truncate leading-none mt-1">{user?.organization}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleTheme}
                    className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 dark:border-dark-border flex items-center justify-center text-neutral-500 dark:text-neutral-400"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 dark:border-dark-border flex items-center justify-center text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area (Mobile) */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Main Content Area (Desktop) */}
      <div className="hidden md:flex flex-col flex-1 pl-64 min-h-screen">
        <main className="flex-1 p-8 overflow-y-auto max-w-7.5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
