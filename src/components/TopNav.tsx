// ============================================================
// TOP NAV — Premium navigation bar with logo, tabs, auth
// ============================================================
import { Home, BarChart3, Target, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { useState } from 'react';

type Tab = 'home' | 'dashboard' | 'level';

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

export default function TopNav({ active, onNavigate }: Props) {
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const tabs: { key: Tab; label: string; icon: typeof Home }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'level', label: 'Level', icon: Target },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/[0.04]" style={{ background: 'rgba(10,10,26,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[17px] font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">VARC</span>
              <span className="text-[17px] font-light tracking-tight text-slate-400 ml-0.5">Arena</span>
            </div>
          </button>

          {/* Centered nav links */}
          <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => onNavigate(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  active === tab.key
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}>
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right — Login / User */}
          {isAuthenticated ? (
            <UserMenu onStart={() => onNavigate('level')} />
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              Login
            </button>
          )}
        </div>
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
