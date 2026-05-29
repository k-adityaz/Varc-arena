// ============================================================
// DIFFICULTY SELECT — 4 cards (Easy, Medium, Hard, CAT Level)
// Card layout: icon top-left, title+sub middle, time+button bottom
// ============================================================
import { Clock, Flame, Crown, Zap, Target } from 'lucide-react';
import { difficultyConfig } from '../data';

interface Props { onSelect: (diff: string) => void; onBack: () => void }

const levels = [
  { key: 'easy',   icon: Zap,    title: 'Easy',       sub: 'Build your foundation',  accent: 'text-emerald-400', bg: 'from-emerald-400 to-green-500',  grad: 'from-emerald-500/10 to-green-600/10',  pillBg: 'bg-emerald-500',   shadow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
  { key: 'medium', icon: Target, title: 'Medium',     sub: 'Step up your game',      accent: 'text-amber-400',   bg: 'from-amber-400 to-orange-500',    grad: 'from-amber-500/10 to-orange-600/10',   pillBg: 'bg-amber-500',     shadow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]' },
  { key: 'hard',   icon: Flame,  title: 'Hard',       sub: 'Advanced challenge',     accent: 'text-red-400',     bg: 'from-red-400 to-rose-500',        grad: 'from-red-500/10 to-rose-600/10',       pillBg: 'bg-red-500',      shadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]' },
  { key: 'cat',    icon: Crown,  title: 'CAT Level',  sub: 'Real CAT difficulty',    accent: 'text-violet-400',  bg: 'from-violet-400 to-purple-600',   grad: 'from-violet-500/10 to-purple-700/10',  pillBg: 'bg-violet-500',   shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]' },
];

export default function DifficultySelect({ onSelect }: Props) {
  return (
    <div className="relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col flex-1">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10 animate-slide-up">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">Select <span className="gradient-text">Difficulty</span></h1>
          <p className="text-sm text-slate-400">Pick a level that matches your preparation.</p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-xl mx-auto w-full">
          {levels.map((lv, i) => {
            const cfg = difficultyConfig[lv.key];
            const totalMin = Math.round(cfg.timePerQuestion * cfg.questionsPerSession / 60);
            return (
              <button
                key={lv.key}
                onClick={() => onSelect(lv.key)}
                className={`group text-left bg-gradient-to-br ${lv.grad} hover:brightness-150 ${lv.shadow} rounded-2xl md:rounded-3xl p-4 md:p-5 border border-white/5 hover:border-white/10 transition-all duration-500 animate-slide-up flex flex-col`}
                style={{ animationDelay: `${0.05 + i * 0.08}s`, opacity: 0 }}
              >
                {/* ===== TOP: Icon (top-left only) ===== */}
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${lv.bg} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <lv.icon className="w-5 h-5 md:w-5.5 md:h-5.5 text-white" />
                </div>

                {/* ===== MIDDLE: Title + Subtitle ===== */}
                <div className="mb-3 md:mb-4 flex-1">
                  <h3 className={`text-[15px] md:text-lg font-bold ${lv.accent} leading-tight`}>{lv.title}</h3>
                  <p className="text-[11px] md:text-xs text-slate-500 mt-0.5 leading-snug">{lv.sub}</p>
                </div>

                {/* ===== BOTTOM: Time left, Pill button right ===== */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] md:text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    {totalMin} min · {cfg.questionsPerSession} Qs
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full ${lv.pillBg} text-white text-[10px] md:text-[11px] font-semibold group-hover:scale-105 transition-transform shadow-md`}>
                    Start
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
