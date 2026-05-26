// ============================================================
// RESULT PAGE — Score card, category breakdown, detailed review
// Shows "Go to Home", "Change Difficulty", "Try Again" buttons
// ============================================================
import { useState } from 'react';
import { RotateCcw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, Target, Brain, BarChart3, Flame } from 'lucide-react';
import { difficultyConfig } from '../data';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import ShareReport from './ShareReport';

interface Props {
  questions: any[];
  answers: (number | null)[];
  timeTaken: number[];
  difficulty: string;
  onRetry: () => void;
  onHome: () => void;
  onGoToLanding: () => void;
}

export default function ResultPage({ questions, answers, timeTaken, difficulty, onRetry, onHome, onGoToLanding }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();

  // ---- Calculate results ----
  const correct = questions.filter((q: any, i: number) => answers[i] === q.correctAnswer).length;
  const wrong = questions.filter((q: any, i: number) => answers[i] !== null && answers[i] !== q.correctAnswer).length;
  const skipped = answers.filter(a => a === null).length;
  const totalTime = timeTaken.reduce((a: number, t: number) => a + t, 0);
  const pct = Math.round((correct / questions.length) * 100);
  const avgTime = Math.round(totalTime / questions.length);

  // Grade
  const grade = pct >= 90 ? { g: 'A+', l: 'Outstanding!', e: '🏆', c: 'text-yellow-400' }
    : pct >= 80 ? { g: 'A', l: 'Excellent!', e: '🌟', c: 'text-emerald-400' }
    : pct >= 70 ? { g: 'B+', l: 'Great Job!', e: '👏', c: 'text-blue-400' }
    : pct >= 60 ? { g: 'B', l: 'Good Effort!', e: '💪', c: 'text-cyan-400' }
    : pct >= 50 ? { g: 'C', l: 'Keep Practicing!', e: '📚', c: 'text-amber-400' }
    : pct >= 40 ? { g: 'D', l: 'Needs Improvement', e: '🎯', c: 'text-orange-400' }
    : { g: 'F', l: "Don't Give Up!", e: '🔥', c: 'text-red-400' };

  // Category breakdown
  const catStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q: any, i: number) => {
    if (!catStats[q.type]) catStats[q.type] = { correct: 0, total: 0 };
    catStats[q.type].total++;
    if (answers[i] === q.correctAnswer) catStats[q.type].correct++;
  });

  const typeLabels: Record<string, string> = { rc: 'Reading Comprehension', 'para-jumble': 'Para Jumble', 'sentence-correction': 'Sentence Correction', vocabulary: 'Vocabulary', grammar: 'Grammar', 'critical-reasoning': 'Critical Reasoning', 'fill-in-blanks': 'Fill in the Blanks' };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />

      {/* Celebration particles for good scores */}
      {pct >= 70 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-float"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#34d399'][i % 5], animationDelay: `${Math.random() * 5}s`, opacity: 0.3 }} />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6"><div /><UserMenu onStart={onHome} /></div>

        {/* ---- Score header ---- */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="text-6xl mb-4">{grade.e}</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Quiz Complete!</h1>
          <p className={`text-xl font-semibold ${grade.c}`}>{grade.l}</p>
          {isAuthenticated && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />Score saved to your history!
            </div>
          )}
        </div>

        {/* ---- Score card ---- */}
        <div className="glass rounded-3xl p-8 md:p-10 mb-8 animate-slide-up stagger-1">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Circular score */}
            <div className="relative">
              <svg className="w-40 h-40" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#sg)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${pct * 3.267} 326.7`} style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} className="transition-all duration-1000" />
                <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#764ba2" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-black text-white">{pct}%</span><span className="text-sm text-slate-400">Score</span></div>
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 flex-1 max-w-sm">
              <MiniStat icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />} value={correct} label="Correct" color="text-emerald-400" />
              <MiniStat icon={<XCircle className="w-6 h-6 text-red-400" />} value={wrong} label="Wrong" color="text-red-400" />
              <MiniStat icon={<Target className="w-6 h-6 text-amber-400" />} value={skipped} label="Skipped" color="text-amber-400" />
              <MiniStat icon={<Clock className="w-6 h-6 text-blue-400" />} value={fmt(totalTime)} label="Total Time" color="text-blue-400" />
            </div>
          </div>
          {/* Grade badge */}
          <div className={`mt-8 flex items-center justify-center gap-3 px-6 py-3 rounded-2xl glass ${grade.c}`}>
            <span className="font-bold text-lg">Grade: {grade.g}</span><span className="text-slate-400">•</span><span className="text-slate-400">{difficultyConfig[difficulty]?.label}</span><span className="text-slate-400">•</span><span className="text-slate-400">Avg: {avgTime}s/q</span>
          </div>
        </div>

        {/* ---- Category breakdown ---- */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-8 animate-slide-up stagger-2">
          <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-indigo-400" /><h2 className="text-xl font-bold text-white">Category Breakdown</h2></div>
          <div className="space-y-4">
            {Object.entries(catStats).map(([type, stats]) => (
              <div key={type} className="flex items-center gap-4">
                <span className="w-40 md:w-48 text-sm text-slate-300">{typeLabels[type] || type}</span>
                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${Math.round((stats.correct / stats.total) * 100)}%` }} />
                </div>
                <span className="text-sm font-mono text-slate-400 w-16 text-right">{stats.correct}/{stats.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Detailed review ---- */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-8 animate-slide-up stagger-3">
          <div className="flex items-center gap-2 mb-6"><Brain className="w-5 h-5 text-purple-400" /><h2 className="text-xl font-bold text-white">Detailed Review</h2></div>
          <div className="space-y-3">
            {questions.map((q: any, i: number) => {
              const isCorrect = answers[i] === q.correctAnswer;
              const isSkipped = answers[i] === null;
              const isOpen = expanded === i;
              return (
                <div key={i} className="rounded-2xl border border-white/5 overflow-hidden">
                  <button onClick={() => setExpanded(isOpen ? null : i)} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSkipped ? 'bg-amber-500/20' : isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {isSkipped ? <Target className="w-4 h-4 text-amber-400" /> : isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm text-slate-300 truncate">Q{i + 1}: {q.question.substring(0, 80)}…</p>
                      <span className="text-xs text-slate-500">{typeLabels[q.type] || q.type} • {fmt(timeTaken[i])}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-white/5 pt-4 animate-fade-in">
                      {q.passage && <div className="mb-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"><p className="text-xs text-blue-300 font-medium mb-2">Passage:</p><p className="text-sm text-slate-400">{q.passage}</p></div>}
                      <p className="text-sm text-slate-300 mb-4">{q.question}</p>
                      <div className="space-y-2 mb-4">
                        {q.options.map((opt: string, j: number) => (
                          <div key={j} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${j === q.correctAnswer ? 'bg-emerald-500/10 border border-emerald-500/20' : j === answers[i] ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'}`}>
                            {j === q.correctAnswer ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : j === answers[i] ? <XCircle className="w-4 h-4 text-red-400" /> : <div className="w-4 h-4 rounded-full border border-white/10" />}
                            <span className={j === q.correctAnswer ? 'text-emerald-300' : j === answers[i] ? 'text-red-300' : 'text-slate-400'}>{opt}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10"><p className="text-sm text-indigo-300 font-medium mb-1">Explanation:</p><p className="text-sm text-slate-400">{q.explanation}</p></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Action buttons ---- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up stagger-4">
          <button onClick={onRetry} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-semibold hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center">
            <RotateCcw className="w-5 h-5" />Try Again
          </button>
          <button onClick={onHome} className="flex items-center gap-2 px-8 py-4 glass rounded-2xl text-white font-semibold hover:bg-white/10 transition-all w-full sm:w-auto justify-center">
            <Target className="w-5 h-5" />Change Difficulty
          </button>
          <button onClick={onGoToLanding} className="flex items-center gap-2 px-8 py-4 glass rounded-2xl text-white font-semibold hover:bg-white/10 transition-all w-full sm:w-auto justify-center">
            <Home className="w-5 h-5" />Go to Home
          </button>
        </div>

        {/* ---- Share report ---- */}
        <div className="mt-6 flex justify-center animate-slide-up stagger-5">
          <ShareReport
            playerName={user?.name || ''}
            difficulty={difficultyConfig[difficulty]?.label || difficulty}
            percentage={pct} correct={correct} wrong={wrong} skipped={skipped}
            total={questions.length} avgTime={avgTime} grade={grade.g} gradeLabel={grade.l}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center"><div className="flex items-center justify-center gap-2 text-slate-500 text-sm"><Flame className="w-4 h-4" />Consistency is key. Keep practicing every day!<Flame className="w-4 h-4" /></div></div>
      </div>
    </div>
  );
}

// ---- Small stat card ----
function MiniStat({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
