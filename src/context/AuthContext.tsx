// ============================================================
// AUTH CONTEXT — Manages user login, logout, and quiz history
// Uses localStorage so sessions persist across refreshes
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// User profile stored after login
export interface User {
  name: string;
  email: string;
  avatar: string; // gradient class for avatar
}

// One entry per completed quiz
export interface QuizHistoryEntry {
  id: string;
  date: string;
  difficulty: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  correct: number;
  wrong: number;
  skipped: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  history: QuizHistoryEntry[];
  login: (name: string, email: string) => void;
  logout: () => void;
  addHistoryEntry: (entry: Omit<QuizHistoryEntry, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Generate a random ID
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// Pick an avatar gradient based on the user's name
const pickAvatar = (name: string) => {
  const gradients = ['from-indigo-400 to-purple-500', 'from-emerald-400 to-teal-500', 'from-rose-400 to-pink-500', 'from-amber-400 to-orange-500', 'from-cyan-400 to-blue-500'];
  return gradients[name.charCodeAt(0) % gradients.length];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);

  // Load saved data from localStorage on first render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('varc_user');
      const savedHistory = localStorage.getItem('varc_history');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch { /* ignore */ }
  }, []);

  const login = useCallback((name: string, email: string) => {
    const newUser: User = { name, email, avatar: pickAvatar(name) };
    setUser(newUser);
    localStorage.setItem('varc_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('varc_user');
  }, []);

  const addHistoryEntry = useCallback((entry: Omit<QuizHistoryEntry, 'id' | 'date'>) => {
    const newEntry: QuizHistoryEntry = { ...entry, id: uid(), date: new Date().toISOString() };
    setHistory(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('varc_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('varc_history');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, history, login, logout, addHistoryEntry, clearHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth state
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
