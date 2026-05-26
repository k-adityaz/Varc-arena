// ============================================================
// USER MENU — Profile dropdown with avatar, stats, history, logout
// Rendered via Portal so it's never clipped by parent containers
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, ChevronDown, BarChart3, Trophy, Clock, Trash2, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props { onStart: () => void }

export default function UserMenu({ onStart }: Props) {
  const { user, logout, history, clearHistory } = useAuth();
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('[data-um]')) { setOpen(false); setShowHistory(false); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!user) return null;

  // Computed stats
  const totalQ = history.length;
  const avgScore = totalQ ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / totalQ) : 0;
  const totalCorrect = history.reduce((s, h) => s + h.correct, 0);
  const totalAnswered = history.reduce((s, h) => s + h.total, 0);
  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Dropdown position (fixed, below the trigger button)
  const dropdownStyle = (): React.CSSProperties => {
    if (!btnRef.current) return { position: 'fixed', top: 0, right: 0, zIndex: 9999 };
    const r = btnRef.current.getBoundingClientRect();
    return { position: 'fixed', top: r.bottom + 8, right: window.innerWidth - r.right, zIndex: 9999 };
  };

  return (
    <>
      {/* Trigger button */}
      <button ref={btnRef} data-um="trigger" onClick={() => { setOpen(!open); setShowHistory(false); setConfirmClear(false); }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass hover:bg-white/10 transition-all group">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatar} flex items-center justify-center text-white text-xs font-bold`}>{initials}</div>
        <span className="hidden md:block text-sm text-slate-300 group-hover:text-white max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown — rendered at body level via Portal */}
      {open && createPortal(
        <div data-um="dropdown" style={dropdownStyle()} className="w-80 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 animate-scale-in max-h-[80vh] overflow-y-auto">

          {/* User info + stats */}
          <div className="p-5 border-b border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.avatar} flex items-center justify-center text-white text-lg font-bold`}>{initials}</div>
              <div className="min-w-0"><p className="font-semibold text-white truncate">{user.name}</p><p className="text-xs text-slate-400 truncate">{user.email}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Stat value={totalQ} label="Quizzes" color="text-indigo-400" />
              <Stat value={`${avgScore}%`} label="Avg Score" color="text-emerald-400" />
              <Stat value={`${accuracy}%`} label="Accuracy" color="text-amber-400" />
            </div>
          </div>

          {/* Menu buttons */}
          <div className="p-2">
            <MenuButton icon={<Flame className="w-4 h-4 text-indigo-400" />} bg="bg-indigo-500/20" title="Start Practice" subtitle="Begin a new quiz"
              onClick={() => { onStart(); setOpen(false); }} hover="hover:bg-indigo-500/10" />
            <MenuButton icon={<BarChart3 className="w-4 h-4 text-purple-400" />} bg="bg-purple-500/20" title="Practice History" subtitle={`${totalQ} sessions`}
              onClick={() => setShowHistory(!showHistory)} hover="hover:bg-purple-500/10" />
          </div>

          {/* History list (expandable) */}
          {showHistory && (
            <div className="border-t border-white/5 max-h-60 overflow-y-auto animate-fade-in">
              {totalQ === 0 ? (
                <div className="p-6 text-center"><Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-sm text-slate-500">No quizzes yet</p></div>
              ) : (
                <>
                  {history.slice(0, 10).map(h => <HistoryRow key={h.id} entry={h} />)}
                  <div className="p-3 border-t border-white/5">
                    {!confirmClear ? (
                      <button onClick={() => setConfirmClear(true)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-red-400 text-xs hover:bg-red-500/10"><Trash2 className="w-3 h-3" />Clear all history</button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-400">Are you sure?</span>
                        <div className="flex gap-2">
                          <button onClick={() => { clearHistory(); setConfirmClear(false); }} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs">Yes</button>
                          <button onClick={() => setConfirmClear(false)} className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 text-xs">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Logout */}
          <div className="p-2 border-t border-white/5">
            <button onClick={() => { logout(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"><LogOut className="w-4 h-4" /><span className="text-sm font-medium">Sign out</span></button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ---- Small helper components ----
function Stat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return <div className="text-center p-2 rounded-lg bg-white/5"><div className={`text-lg font-bold ${color}`}>{value}</div><div className="text-[10px] text-slate-500 uppercase">{label}</div></div>;
}

function MenuButton({ icon, bg, title, subtitle, onClick, hover }: { icon: React.ReactNode; bg: string; title: string; subtitle: string; onClick: () => void; hover: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${hover} transition-colors`}>
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      <div className="text-left"><p className="text-sm font-medium">{title}</p><p className="text-[11px] text-slate-500">{subtitle}</p></div>
    </button>
  );
}

const diffColors: Record<string, string> = { Easy: 'text-emerald-400 bg-emerald-500/10', Medium: 'text-amber-400 bg-amber-500/10', Hard: 'text-red-400 bg-red-500/10', 'CAT Level': 'text-violet-400 bg-violet-500/10' };

function HistoryRow({ entry }: { entry: any }) {
  const c = entry.percentage >= 70 ? 'text-emerald-400' : entry.percentage >= 50 ? 'text-amber-400' : 'text-red-400';
  const dc = diffColors[entry.difficulty] || 'text-slate-400 bg-white/5';
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${dc}`}>{entry.difficulty}</span>
          <span className={`text-sm font-bold ${c}`}>{entry.percentage}%</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-slate-500">{entry.correct}/{entry.total} correct</span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>
    </div>
  );
}
