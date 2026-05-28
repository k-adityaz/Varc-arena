// ============================================================
// LANDING PAGE — Hero, Why, How It Works, Categories, Testimonials, Footer
// TopNav is rendered by App.tsx above this page
// ============================================================

import { Brain, Clock, Trophy, ChevronRight, Sparkles, Target, Users, BookOpen, UserPlus, LayoutGrid, LineChart, Star, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
interface Props { onStart: () => void }

export default function LandingPage({ onStart }: Props) {
  const {
  isAuthenticated,
  xp,
  level,
  history,
} = useAuth();

const currentLevelXp = xp % 500;

const xpProgress =
  (currentLevelXp / 500) * 100;

const streak = [
  ...new Set(
    history
      .filter(h => h.date)
      .map(h =>
        new Date(h.date!)
          .toDateString()
      )
  ),
].length;

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
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-indigo-500/5 rounded-full animate-rotate-slow" />

      <div className="relative z-10">

        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-indigo-300 mb-8 animate-slide-up stagger-1">
            <Sparkles className="w-4 h-4" />
            <span>CAT 2026 Preparation Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-slide-up stagger-2 leading-tight">
            <span className="text-white">Master </span><span className="gradient-text">VARC</span><br />
            <span className="text-white">Like a </span><span className="gradient-text-warm">Pro</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 animate-slide-up stagger-3 leading-relaxed">
            The only platform that trains your VARC speed and accuracy together. 
            Stop guessing. <span className="text-slate-200 font-medium">Start scoring.</span>
          </p>
{/* ===== PLAYER HUD ===== */}
{isAuthenticated && (
  <div className="max-w-2xl mx-auto mb-10 animate-slide-up stagger-4">

    <div className="glass rounded-3xl p-5 border border-indigo-500/20 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">

        {/* Top */}
        <div className="flex items-center justify-between mb-4">

          <div>
            <div className="flex items-center gap-3">

              <div className="relative">

  {/* Glow */}
  <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-md animate-pulse" />

  {/* Level Box */}
  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
    {level}
  </div>

</div>

              <div className="text-left">
                <h3 className="text-white font-black text-xl">
                  Level {level}
                </h3>

                <p className="text-sm bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent font-semibold">
                  {levelTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">

            <div className="text-indigo-300 font-black text-lg">
              ⚡ {xp} XP
            </div>

            <div className="text-orange-300 text-sm font-semibold">
              🔥 {streak} Day Streak
            </div>

          </div>
        </div>

        {/* Progress */}
        <div>

          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">
              Progress to Level {level + 1}
            </span>

            <span className="text-indigo-300 font-bold">
              {currentLevelXp}/500 XP
            </span>
          </div>

          <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-white/10">

            <div
  className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.5)] overflow-hidden"
              style={{
                width: `${Math.min(xpProgress, 100)}%`,
              }}
            >

  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
          {/* CTA */}
          <button onClick={onStart}
            className="group px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-3 hover:scale-105 active:scale-95 mx-auto transition-all duration-300 animate-slide-up stagger-6"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 0 40px rgba(99,102,241,0.25)' }}>
            Try a Free Question
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto mt-20 animate-slide-up stagger-5">
            {[
              { icon: Brain, value: '2,000+', label: 'Questions' },
              { icon: Target, value: '4', label: 'Difficulty Levels' },
              { icon: Clock, value: '45s/q', label: 'Timed Practice' },
              { icon: Users, value: '100%', label: 'CAT Focused' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 md:p-5 text-center hover:bg-white/10 transition-all duration-300">
                <s.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* WHY VARC ARENA */}
        {/* ============================================================ */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">Why <span className="gradient-text">VARC Arena</span>?</h2>
          <p className="text-slate-400 text-center mb-16 max-w-lg mx-auto">Designed for CAT aspirants who want to ace the verbal section</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Stop Running Out of Time', desc: "45-second timers on every question train your brain to think faster under real CAT exam pressure.", grad: 'from-blue-500 to-cyan-500' },
              { icon: Target, title: 'Start Easy. Get CAT-Ready in Weeks.', desc: "4 progressive difficulty levels take you from warm-up to CAT-level questions step by step.", grad: 'from-purple-500 to-pink-500' },
              { icon: Trophy, title: "Know Exactly Where You're Losing Marks", desc: "Detailed performance analytics and answer explanations show you your weak spots after every session.", grad: 'from-orange-500 to-red-500' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* HOW IT WORKS */}
        {/* ============================================================ */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">How It <span className="gradient-text-warm">Works</span></h2>
          <p className="text-slate-400 text-center mb-16">Get started in 3 simple steps</p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-px bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30" />

            {[
              { num: '1', icon: UserPlus, title: 'Create Free Account', desc: 'Sign up in 30 seconds. No credit card required.' },
              { num: '2', icon: LayoutGrid, title: 'Pick Your Category', desc: 'Choose from RC, Para Jumbles, Vocabulary, Grammar and more.' },
              { num: '3', icon: LineChart, title: 'Practice & Track Progress', desc: 'Attempt timed questions and watch your score improve on the dashboard.' },
            ].map((step, i) => (
              <div key={i} className="text-center relative animate-slide-up" style={{ animationDelay: `${0.1 + i * 0.15}s`, opacity: 0 }}>
                {/* Number badge */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* QUESTION CATEGORIES */}
        {/* ============================================================ */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Question <span className="gradient-text-warm">Categories</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Reading Comprehension', desc: 'RC passages, 3 difficulty levels' },
              { name: 'Para Jumbles', desc: 'Sequence logic questions' },
              { name: 'Sentence Correction', desc: 'Grammar + meaning errors' },
              { name: 'Vocabulary', desc: 'CAT-level word usage' },
              { name: 'Grammar', desc: 'Rules + application' },
              { name: 'Critical Reasoning', desc: 'Argument-based questions' },
              { name: 'Fill in the Blanks', desc: 'Context + vocabulary' },
            ].map((cat, i) => (
              <div key={i} className="glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:scale-125 transition-transform" />
                  <span className="text-[15px] font-semibold text-white">{cat.name}</span>
                </div>
                <p className="text-sm text-slate-500 pl-5">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SOCIAL PROOF */}
        {/* ============================================================ */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">Trusted by CAT <span className="gradient-text">Aspirants</span></h2>
          <p className="text-slate-400 text-center mb-16">Real results from real students</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rahul M.', score: '97.4', text: "VARC Arena's timed practice completely changed how I approach RC. I went from 60% to 85% accuracy in 3 weeks." },
              { name: 'Priya S.', score: '98.1', text: "The difficulty progression is perfect. I could feel myself getting faster with every session." },
              { name: 'Arjun K.', score: '96.8', text: "The analytics showed me I was weak in Para Jumbles specifically. Fixed that in 2 weeks. Highly recommend." },
            ].map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-300 leading-relaxed mb-6 text-[15px]">"{t.text}"</p>
                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {t.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-slate-500">CAT {t.score} percentile</div>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-indigo-500/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <footer className="border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
            <div className="grid md:grid-cols-3 gap-8 items-start mb-10">
              {/* Left — Logo + tagline */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[15px] font-extrabold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">VARC</span>
                    <span className="text-[15px] font-light text-slate-500 ml-0.5">Arena</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">Master VARC. Crack CAT.</p>
              </div>

              {/* Center — Links */}
              <div className="flex flex-col items-start md:items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-1">Navigate</span>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Home</a>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</a>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Levels</a>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</a>
              </div>

              {/* Right — Copyright */}
              <div className="md:text-right">
                <p className="text-sm text-slate-500">© 2026 VARC Arena.</p>
                <p className="text-sm text-slate-600 mt-1">All rights reserved.</p>
              </div>
            </div>

            {/* Bottom line */}
            <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms of Use</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
