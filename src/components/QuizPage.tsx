// ============================================================
// QUIZ PAGE — Timed MCQ quiz with sound + haptic feedback
// Shows question, 4 options, timer, explanation after answering
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, ChevronLeft, Flag, X, CheckCircle2, XCircle, AlertCircle, BookOpen, ArrowRight, Brain, Volume2, VolumeX } from 'lucide-react';
import { difficultyConfig } from '../data';
import { playTick, playWarnTick, playSuccess, playError, vibrate } from '../utils/sound';
import UserMenu from './UserMenu';
import { shuffleArray } from '../utils/shuffle';
interface Props {
  questions: any[];
  difficulty: string;
  onFinish: (answers: (number | null)[], timeTaken: number[]) => void;
  onQuit: () => void;
}

// Colors for question type badges
const typeColors: Record<string, string> = {
  rc: 'bg-blue-500/20 text-blue-300', 'para-jumble': 'bg-purple-500/20 text-purple-300',
  'sentence-correction': 'bg-cyan-500/20 text-cyan-300', vocabulary: 'bg-emerald-500/20 text-emerald-300',
  grammar: 'bg-amber-500/20 text-amber-300', 'critical-reasoning': 'bg-rose-500/20 text-rose-300',
  'fill-in-blanks': 'bg-indigo-500/20 text-indigo-300',
};
const typeLabels: Record<string, string> = { rc: 'Reading Comprehension', 'para-jumble': 'Para Jumble', 'sentence-correction': 'Sentence Correction', vocabulary: 'Vocabulary', grammar: 'Grammar', 'critical-reasoning': 'Critical Reasoning', 'fill-in-blanks': 'Fill in the Blanks' };
const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizPage({ questions, difficulty, onFinish, onQuit }: Props) {
  const [qi, setQi] = useState(0);                    // current question index
  const [randomizedQuestions] = useState(() => shuffleArray(questions));
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [timeLeft, setTimeLeft] = useState(45);       // seconds remaining
  const [timeTaken, setTimeTaken] = useState<number[]>(questions.map(() => 0));
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);         // answer locked in?
  const [transitioning, setTransitioning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const soundRef = useRef(true);
  const startRef = useRef(Date.now());

  useEffect(() => { soundRef.current = soundOn; }, [soundOn]);

  const q = randomizedQuestions[qi];
  const totalTime = difficultyConfig[difficulty]?.timePerQuestion || 45;
  const progress = ((qi + (locked ? 1 : 0)) / randomizedQuestions.length) * 100;
  const isLast = qi === randomizedQuestions.length - 1;

  // ---- Handle time running out ----
  const handleTimeUp = useCallback(() => {
    if (!locked) {
      setLocked(true);
      setTimeTaken(prev => { const t = [...prev]; t[qi] = totalTime; return t; });
      if (soundRef.current) playError();
      vibrate([100, 50, 100]);
    }
  }, [qi, totalTime, locked]);

  // ---- Timer countdown ----
  useEffect(() => {
    if (locked || transitioning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleTimeUp(); return 0; }
        const next = prev - 1;
        if (soundRef.current) { next <= 10 ? (playWarnTick(), vibrate(15)) : playTick(); }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qi, locked, transitioning, handleTimeUp]);

  // Track when each question starts
  useEffect(() => { startRef.current = Date.now(); }, [qi]);

  // ---- Lock in the selected answer ----
  const lockAnswer = () => {
    if (selected === null) return;
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    setLocked(true);
    setAnswers(prev => { const a = [...prev]; a[qi] = selected; return a; });
    setTimeTaken(prev => { const t = [...prev]; t[qi] = elapsed; return t; });
    if (soundRef.current) { selected === q.correctAnswer ? (playSuccess(), vibrate([20, 50, 20])) : (playError(), vibrate([50, 30, 50])); }
  };

  // ---- Navigate between questions ----
  const goTo = (index: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setQi(index);
      const ans = answers[index];
      setSelected(ans);
      setLocked(ans !== null);
      setTimeLeft(totalTime);
      setTransitioning(false);
    }, 200);
  };

  const goNext = () => {
    if (isLast) { onFinish(answers, timeTaken); return; }
    goTo(qi + 1);
    if (!locked) setSelected(null);
  };

  const skip = () => { if (isLast) { onFinish(answers, timeTaken); return; } goTo(qi + 1); setSelected(null); setLocked(false); setTimeLeft(totalTime); };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const timerPct = (timeLeft / totalTime) * 100;
  const timerColor = timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-amber-400' : 'text-emerald-400';
  const timerStroke = timeLeft <= 10 ? '#f87171' : timeLeft <= 20 ? '#fbbf24' : '#34d399';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />

      <div className="relative z-10">
        {/* ---- Sticky top bar ---- */}
        <div className="glass-dark sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="h-1 bg-white/5"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
            <div className="flex items-center justify-between py-3">
              {/* Left: quit + type badge */}
              <div className="flex items-center gap-3">
                <button onClick={onQuit} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                <div className={`hidden sm:block px-3 py-1 rounded-lg text-xs font-semibold ${typeColors[q.type] || 'bg-white/10 text-slate-300'}`}>{typeLabels[q.type] || q.type}</div>
                <span className="hidden sm:block text-slate-500 text-sm">{qi + 1}/{questions.length}</span>
              </div>
              {/* Center: sound toggle + timer */}
              <div className="flex items-center gap-2">
                <button onClick={() => setSoundOn(!soundOn)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all" title={soundOn ? 'Mute' : 'Unmute'}>
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl glass ${timeLeft <= 10 ? 'animate-timer-pulse' : ''}`}>
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 timer-circle" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke={timerStroke} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${timerPct * 0.975} 100`} className="transition-all duration-1000" />
                    </svg>
                    <Clock className={`absolute inset-0 m-auto w-3.5 h-3.5 ${timerColor}`} />
                  </div>
                  <span className={`font-mono font-bold text-lg ${timerColor}`}>{fmt(timeLeft)}</span>
                </div>
              </div>
              {/* Right: difficulty + user */}
              <div className="flex items-center gap-3">
                <div className={`hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r ${difficultyConfig[difficulty]?.color} text-white`}>{difficultyConfig[difficulty]?.label}</div>
                <div className="hidden sm:block"><UserMenu onStart={onQuit} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Question content ---- */}
        <div className={`max-w-4xl mx-auto px-4 md:px-6 py-8 transition-all duration-300 ${transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {/* Mobile info */}
          <div className="sm:hidden flex items-center justify-between mb-4">
            <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeColors[q.type] || 'bg-white/10 text-slate-300'}`}>{typeLabels[q.type] || q.type}</div>
            <span className="text-slate-500 text-sm">{qi + 1}/{questions.length}</span>
          </div>

          {/* Dot navigation */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {questions.map((_: any, i: number) => (
              <button key={i} onClick={() => i !== qi && goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === qi ? 'bg-indigo-500 scale-125' : answers[i] !== null ? 'bg-emerald-500' : 'bg-white/20 hover:bg-white/30'}`} />
            ))}
          </div>

          {/* Passage (RC only) */}
          {q.passage && (
            <div className="glass rounded-2xl p-6 mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4 text-blue-400" /><span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Passage</span></div>
              <p className="text-slate-300 leading-relaxed text-[15px]">{q.passage}</p>
            </div>
          )}

          {/* Question */}
          <div className="glass rounded-2xl p-6 md:p-8 mb-8 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">Q{qi + 1}</div>
              <p className="text-lg text-white leading-relaxed pt-1.5 whitespace-pre-line">{q.question}</p>
            </div>
          </div>

          {/* 4 Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((opt: string, i: number) => {
              const correct = i === q.correctAnswer;
              const picked = i === selected;
              const rightPick = locked && picked && correct;
              const wrongPick = locked && picked && !correct;
              const border = rightPick ? 'border-emerald-500/50 bg-emerald-500/10' : wrongPick ? 'border-red-500/50 bg-red-500/10' : locked && correct ? 'border-emerald-500/30 bg-emerald-500/5' : picked ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5';
              const letterBg = rightPick ? 'bg-emerald-500 text-white' : wrongPick ? 'bg-red-500 text-white' : picked ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400';
              const textColor = rightPick ? 'text-emerald-300' : wrongPick ? 'text-red-300' : picked ? 'text-white' : 'text-slate-300 group-hover:text-white';

              return (
                <button key={i} onClick={() => { if (!locked) { setSelected(i); vibrate(5); } }} disabled={locked}
                  className={`option-card w-full text-left p-4 md:p-5 rounded-2xl border ${border} flex items-start gap-4 group animate-slide-up`} style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${letterBg}`}>
                    {rightPick ? <CheckCircle2 className="w-5 h-5" /> : wrongPick ? <XCircle className="w-5 h-5" /> : LETTERS[i]}
                  </div>
                  <span className={`text-[15px] leading-relaxed pt-1 ${textColor}`}>{opt}</span>
                  {locked && correct && !picked && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {locked && (
            <div className="glass rounded-2xl p-6 mb-8 animate-scale-in">
              <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5 text-indigo-400" /><span className="font-semibold text-indigo-400">Explanation</span></div>
              <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* ---- Bottom action buttons ---- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => qi > 0 && goTo(qi - 1)} disabled={qi === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-slate-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Previous</span>
              </button>
              {!locked && (
                <button onClick={skip} className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-400 hover:text-white"><Flag className="w-4 h-4" /><span className="hidden sm:inline text-sm">Skip</span></button>
              )}
            </div>
            {!locked ? (
              <button onClick={lockAnswer} disabled={selected === null}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-30">
                Lock Answer <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={goNext} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all group">
                {isLast ? 'Finish Quiz' : 'Next Question'} {isLast ? <Flag className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            )}
          </div>

          {/* Time warning */}
          {!locked && timeLeft <= 10 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-red-400 animate-fade-in"><AlertCircle className="w-4 h-4" /><span className="text-sm">Hurry! Time is running out!</span></div>
          )}
        </div>
      </div>
    </div>
  );
}
