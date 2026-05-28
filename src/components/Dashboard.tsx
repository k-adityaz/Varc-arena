// ============================================================
// DASHBOARD — Premium analytics with line graph, stats, history
// ============================================================
import { BarChart3, Trophy, Flame, Clock, Target, TrendingUp, Calendar, BookOpen, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const {
  user,
  history,
  isAuthenticated,
  xp,
  level,
} = useAuth();
  const [focusMode, setFocusMode] = useState(false);

  // ---- Computed stats ----
  const totalQuizzes = history.length;
  const totalCorrect = history.reduce((s, h) => s + h.correct, 0);
  const totalAnswered = history.reduce((s, h) => s + h.total, 0);
  const avgScore = totalQuizzes ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / totalQuizzes) : 0;
  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const totalTime = history.reduce((s, h) => s + h.timeTaken, 0);
  const bestScore = totalQuizzes ? Math.max(...history.map(h => h.percentage)) : 0;
const currentLevelXp = xp % 500;

const xpProgress = Math.min(
  (currentLevelXp / 500) * 100,
  100
);

const levelTitles = [
  "Rookie",
  "Learner",
  "Solver",
  "Challenger",
  "VARC Warrior",
  "Mind Hacker",
  "Elite Reader",
  "CAT Slayer",
  "Titan",
  "Legend",
];

const levelTitle =
  levelTitles[level - 1] || "Immortal";
  // Streak
  const getStreak = () => {
    if (!history.length) return 0;
    const days = [
  ...new Set(
    history.map(h =>
      new Date(h.date || h.createdAt).toDateString()
    )
  )
].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      if ((new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / (86400000) <= 1.5) streak++;
      else break;
    }
    return days.length ? streak : 0;
  };
  const streak = getStreak();

  // Trend
  const last5 = history.slice(0, 5);
  const prev5 = history.slice(5, 10);
  const last5Avg = last5.length ? Math.round(last5.reduce((s, h) => s + h.percentage, 0) / last5.length) : 0;
  const prev5Avg = prev5.length ? Math.round(prev5.reduce((s, h) => s + h.percentage, 0) / prev5.length) : 0;
  const trendUp = last5Avg >= prev5Avg;

  // Difficulty breakdown
  const diffStats: Record<string, { total: number; correct: number; count: number }> = {};
  history.forEach(h => {
    if (!diffStats[h.difficulty]) diffStats[h.difficulty] = { total: 0, correct: 0, count: 0 };
    diffStats[h.difficulty].total += h.total;
    diffStats[h.difficulty].correct += h.correct;
    diffStats[h.difficulty].count++;
  });
  const diffBarColors: Record<string, string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-red-500',
  'cat level': 'bg-violet-500',
  cat: 'bg-violet-500',
};

  const initials = (user?.displayName || 'User')
  .split(' ')
  .map(w => w[0])
  .join('')
  .toUpperCase()
  .slice(0, 2);

  // Line chart data — last 15 quizzes (reversed so oldest is left)
  const chartData = history.slice(0, 15).reverse();

  return (
    <div className={`max-w-6xl mx-auto px-4 md:px-8 py-8 transition-all duration-300 ${focusMode ? 'max-w-3xl' : ''}`}>
      {/* ---- Focus mode toggle ---- */}
      <div className="flex items-center justify-end mb-4">
        <button onClick={() => setFocusMode(!focusMode)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          {focusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {focusMode ? 'Exit Focus' : 'Focus Mode'}
        </button>
      </div>

      {/* ---- Not signed in ---- */}
      {!isAuthenticated ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><BarChart3 className="w-10 h-10 text-white" /></div>
          <h2 className="text-3xl font-bold text-white mb-3">Your Dashboard</h2>
          <p className="text-slate-400 max-w-md mx-auto">Sign in to track your progress, view detailed analytics, and watch yourself improve!</p>
        </div>
      ) : (
        <>
          {/* ---- Welcome ---- */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold`}>{initials}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {(user?.displayName || 'User').split(' ')[0]}! 👋</h1>
              <p className="text-slate-400 text-sm">{totalQuizzes === 0 ? "Start your first quiz to see stats here!" : `${streak} day streak 🔥 • ${totalQuizzes} quizzes completed`}</p>
            </div>
          </div>
{/* ---- XP CARD ---- */}
<div className="glass rounded-3xl p-6 mb-8 overflow-hidden relative animate-slide-up">

  {/* Glow */}
  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />

  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    {/* Left */}
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
          {level}
        </div>

        <div>
          <div className="flex items-center gap-3">

  <h2 className="text-4xl font-black text-white tracking-tight">
    Level {level}
  </h2>

  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold shadow-lg shadow-pink-500/20 animate-pulse">
    HOT STREAK
  </div>

</div>

          <p className="text-lg font-semibold bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
  {levelTitle}
</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">

  <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold">
    ⚡ {xp} XP
  </div>

  <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-bold">
    🔥 Active
  </div>

</div>
    </div>

    {/* Right */}
    <div className="w-full md:w-80">

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">
          Progress to Level {level + 1}
        </span>

        <span className="text-xs font-bold text-indigo-300">
          {currentLevelXp}/500 XP
        </span>
      </div>

      <div className="h-5 bg-black/30 rounded-full overflow-hidden border border-white/10 shadow-inner">

        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          style={{
            width: `${xpProgress}%`,
          }}
        />
      </div>
    </div>
  </div>
</div>
          {/* ---- Stat cards ---- */}
          <div className={`grid ${focusMode ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-3 mb-8 animate-slide-up stagger-1`}>
            <StatCard icon={<Trophy className="w-5 h-5" />} value={avgScore + '%'} label="Avg Score" gradient="from-indigo-500 to-purple-600" focus={focusMode} />
            <StatCard icon={<Target className="w-5 h-5" />} value={accuracy + '%'} label="Accuracy" gradient="from-emerald-500 to-teal-600" focus={focusMode} />
            {!focusMode && <StatCard icon={<Flame className="w-5 h-5" />} value={streak} label="Day Streak" gradient="from-orange-500 to-red-600" focus={false} />}
            {!focusMode && <StatCard icon={<TrendingUp className="w-5 h-5" />} value={bestScore + '%'} label="Best Score" gradient="from-cyan-500 to-blue-600" focus={false} />}
          </div>

          {/* ---- LINE GRAPH: Score Trend ---- */}
          <div className="glass rounded-3xl p-7 mb-8 border border-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.35)] animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold tracking-tight text-white flex items-center gap-2 text-[17px]"><TrendingUp className="w-4 h-4 text-indigo-400" />Score Trend</h3>
              {totalQuizzes > 0 && (
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-inner ${trendUp ? 'bg-emerald-500/8 border border-emerald-400/10 text-emerald-300 backdrop-blur-xl' : 'bg-red-500/10 text-red-400'}`}>
                  {trendUp ? '↑ Improving' : '↓ Needs focus'}
                </span>
              )}
            </div>

            {chartData.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-12">No data yet. Complete quizzes to see your trend line!</p>
            ) : (
              <div className="relative" style={{ height: '340px' }}>
                {/* ===== Y-AXIS (score % labels, vertical on the left) ===== */}
                <div className="absolute left-0 top-0 bottom-[40px] flex flex-col justify-between text-[10px] text-slate-600 font-medium w-[32px] text-right pr-2">
  <span>100</span>
  <span>75</span>
  <span>50</span>
  <span>25</span>
  <span>0</span>
</div>

                {/* ===== Chart body ===== */}
                
                <div className="absolute left-[40px] right-0 top-0 bottom-[40px]">
<div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none" />
                  {/* Horizontal grid lines */}
                  {[0, 25, 50, 75, 100].map(v => (
                    <div key={v} className="absolute left-0 right-0 border-t border-white/[0.025]" style={{ bottom: `${v}%` }} />
                  ))}

                  {/* Plot points (absolutely positioned dots + lines + fill) */}
                  {chartData.length > 0 && (() => {
                    const n = chartData.length;
                    const getX = (i: number) => n === 1 ? 50 : (i / (n - 1)) * 100;
                    const getY = (pct: number) => 100 - pct; // 0%=bottom, 100%=top

                    // Build polyline points string
                    const pointsStr = chartData.map((h, i) => `${getX(i)}%,${getY(h.percentage)}%`).join(' ');

                    // Build polygon for area fill (same line + close to bottom)
                    const areaStr = pointsStr + `, ${getX(n - 1)}%,100% ${getX(0)}%,100%`;

                    return (
                      <>
                        {/* Area fill under the line */}
                        <div
                          className="absolute inset-0"
                          style={{
                            clipPath: `polygon(${areaStr})`,
                            background: `
linear-gradient(
to top,
rgba(99,102,241,0.02),
rgba(99,102,241,0.08),
rgba(139,92,246,0.18)
)
`,
filter: 'blur(0.2px)',
                          }}
                        />

                        {/* The line using SVG (single thin SVG covering the area) */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#6366f1" />
    <stop offset="50%" stopColor="#8b5cf6" />
    <stop offset="100%" stopColor="#06b6d4" />
  </linearGradient>
</defs>
<polyline
className="animate-[dash_2s_ease_forwards]"
                            points={chartData.map((h, i) => `${getX(i)},${getY(h.percentage)}`).join(' ')}
                            fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                            style={{
  filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.45))'
}}
                          />
                        </svg>

                        {/* Dots + score labels on each point */}
                        {chartData.map((h, i) => (
                          <div key={i}>
                      
                            {/* Dot */}
                            <div
                              className="absolute w-2.5 h-2.5 rounded-full bg-white border border-indigo-400/70"
                              style={{
                                left: `${getX(i)}%`,
                                bottom: `${getY(h.percentage)}%`,
                                transform: 'translate(-50%, 50%)',
                              }}
                            />
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>

                {/* ===== X-AXIS (dates, horizontal at the bottom) ===== */}
                <div className="absolute left-[40px] right-0 bottom-0 h-[40px] flex items-start pt-2">
                  <div className="flex w-full justify-between">
                    {chartData.map((h, i) => {
                      // Show only every Nth label to avoid overlap
                      const showEvery =
  chartData.length > 12
    ? 4
    : chartData.length > 8
    ? 3
    : chartData.length > 5
    ? 2
    : 1;
                      const show = i % showEvery === 0 || i === chartData.length - 1;
                      return (
                        <div key={i} className="text-center" style={{ width: '0', flex: `${1}` }}>
                          {/* Tick mark */}
                          <div className="w-px h-2 bg-slate-700 mx-auto mb-1" />
                          {show && (
                            <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap">
                              {new Date(h.date || h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---- Difficulty breakdown ---- */}
          {!focusMode && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-2xl p-6 animate-slide-up stagger-3">
                <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-purple-400" />By Difficulty</h3>
                {Object.keys(diffStats).length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No data yet.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(diffStats).map(([diff, stats]) => {
                      const pct = Math.round((stats.correct / stats.total) * 100);
                      return (
                        <div key={diff}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-slate-300">{diff} <span className="text-slate-500 text-xs">({stats.count} quizzes)</span></span>
                            <span className="text-sm font-bold text-white">{pct}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${diffBarColors[diff] || 'bg-indigo-500'} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-1 gap-3 animate-slide-up stagger-4">
                <div className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><BookOpen className="w-5 h-5 text-indigo-400" /></div>
                  <div><div className="text-xl font-bold text-white">{totalAnswered}</div><div className="text-xs text-slate-400">Questions Solved</div></div>
                </div>
                <div className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center"><Clock className="w-5 h-5 text-cyan-400" /></div>
                  <div><div className="text-xl font-bold text-white">{Math.round(totalTime / 60)}m</div><div className="text-xs text-slate-400">Total Practice Time</div></div>
                </div>
                <div className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"><Calendar className="w-5 h-5 text-amber-400" /></div>
                  <div><div className="text-xl font-bold text-white">{totalCorrect}</div><div className="text-xs text-slate-400">Correct Answers</div></div>
                </div>
              </div>
            </div>
          )}

          {/* ---- History ---- */}
          <div className="glass rounded-2xl p-6 animate-slide-up stagger-5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-blue-400" />Practice History</h3>
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No quizzes yet. Go to Level tab and start practicing!</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {history.map((h) => {
                  const c = h.percentage >= 70 ? 'text-emerald-400' : h.percentage >= 50 ? 'text-amber-400' : 'text-red-400';
                  const bg = h.percentage >= 70 ? 'bg-emerald-500/20' : h.percentage >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20';
                  const d = new Date(h.date || h.createdAt);
                  return (
                    <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        {h.percentage >= 70 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white ">
  {(
  {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    cat: 'CAT Level',
    'cat level': 'CAT Level',
  } as Record<string, string>
)[h.difficulty] || h.difficulty}
</span>
                          <span className={`text-sm font-bold ${c}`}>{h.percentage}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{h.correct}/{h.total}</span><span>•</span>
                          <span>{d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span><span>•</span>
                          <span>{Math.round(h.timeTaken/60)}m</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, gradient, focus }: { icon: React.ReactNode; value: string | number; label: string; gradient: string; focus: boolean }) {
  return (
    <div className={`glass rounded-2xl p-4 ${focus ? 'p-5' : 'md:p-5'} animate-slide-up`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3`}>{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
