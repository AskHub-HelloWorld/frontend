import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  CircleHelp, 
  ShoppingBag, 
  Settings,
  LogOut,
  User as UserIcon,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean, key?: React.Key }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center rounded-lg transition-all duration-300 group relative h-12 shrink-0 overflow-hidden",
      collapsed ? "w-12" : "w-full",
      isActive 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
    )}
  >
    <div className="w-12 h-12 flex items-center justify-center shrink-0">
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 0.2, delay: 0.3 },
          }}
          className="font-medium whitespace-nowrap overflow-hidden ml-2"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
    {collapsed && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-bg-surface border border-border rounded text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </NavLink>
);

const Logo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex items-center w-full relative h-10">
    <div className="absolute left-0 w-20 flex justify-center items-center shrink-0">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
        <img 
          src="/icon.svg" 
          alt="Ask Hub Logo"
          className="w-6 h-6"
        />
      </div>
    </div>
    <AnimatePresence mode="wait">
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 0.2, delay: 0.3 },
          }}
          className="font-heading font-bold text-xl text-primary tracking-tight whitespace-nowrap pl-20"
        >
          Ask Hub
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: '홈' },
    { to: '/chat', icon: MessageSquare, label: 'AI 채팅' },
    { to: '/knowledge', icon: CircleHelp, label: '지식인' },
    { to: '/store', icon: ShoppingBag, label: '상점' },
  ];

  const initials = user?.name.substring(1, 3) || '??';

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 240 }}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className="hidden lg:flex flex-col border-r border-border bg-bg-surface sticky top-0 h-screen z-40 transition-all shadow-xl shadow-bg-base/5 overflow-hidden"
      >
        <div className="h-20 flex items-center overflow-hidden shrink-0">
          <Logo collapsed={collapsed} />
        </div>

        <nav className="flex-1 space-y-2 mt-4 px-4 overflow-hidden">
          {navItems.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        <div className="px-4 pb-4 border-t border-border shrink-0 mt-auto pt-4 overflow-hidden">
          <SidebarItem to="/mypage" icon={Settings} label="설정" collapsed={collapsed} />
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-bg-surface z-50 lg:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <img 
                    src="/icon.svg" 
                    alt="Ask Hub Logo"
                    className="w-6 h-6"
                  />
                  </div>
                  <span className="font-heading font-bold text-2xl text-primary">Ask Hub</span>
                </div>
                <button onClick={() => setMobileOpen(false)}><X /></button>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-4 px-4 py-3 rounded-lg transition-all",
                      isActive ? "bg-primary text-white" : "text-text-secondary hover:bg-bg-elevated"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-[60px] sticky top-0 z-30 bg-bg-base/80 backdrop-blur-md border-b border-border px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="hidden lg:block font-heading font-semibold text-lg text-text-primary">
              {navItems.find(i => window.location.pathname.startsWith(i.to))?.label || '대시보드'}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <button className="p-2 text-text-secondary hover:text-text-primary relative group">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-bg-base" />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-bg-elevated transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-border-light group-hover:border-primary transition-colors">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-text-secondary group-hover:text-text-primary">
                  {user?.name}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border rounded-xl shadow-2xl z-20 py-2 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-border mb-2">
                        <p className="text-sm font-bold text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                      </div>
                      <button 
                        onClick={() => { navigate('/mypage'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                      >
                        <UserIcon size={16} /> 프로필 설정
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger/10"
                      >
                        <LogOut size={16} /> 로그아웃
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
