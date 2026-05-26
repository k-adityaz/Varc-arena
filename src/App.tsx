// ============================================================
// APP — Main entry point. Manages navigation and quiz state.
// ============================================================
import { useState, useCallback } from 'react';
import TopNav from './components/TopNav';
import LandingPage from './components/LandingPage';
import DifficultySelect from './components/DifficultySelect';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getRandomQuestions, difficultyConfig } from './data';

type Screen = 'home' | 'dashboard' | 'level' | 'quiz' | 'results';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeTaken, setTimeTaken] = useState<number[]>([]);

  const { addHistoryEntry, isAuthenticated } = useAuth();

  // Start a quiz with the chosen difficulty
  const startQuiz = useCallback((diff: string) => {
    const qs = getRandomQuestions(diff, 25);
    setDifficulty(diff);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setTimeTaken(new Array(qs.length).fill(0));
    setScreen('quiz');
  }, []);

  // Finish quiz, calculate score, save to history
  const finishQuiz = useCallback((ans: (number | null)[], time: number[]) => {
    const correct = questions.filter((q, i) => ans[i] === q.correctAnswer).length;
    const wrong = questions.filter((q, i) => ans[i] !== null && ans[i] !== q.correctAnswer).length;
    const skipped = ans.filter(a => a === null).length;
    const totalTime = time.reduce((a, t) => a + t, 0);
    const pct = Math.round((correct / questions.length) * 100);

    if (isAuthenticated) {
      addHistoryEntry({
        difficulty: difficultyConfig[difficulty]?.label || difficulty,
        score: correct, total: questions.length, percentage: pct,
        timeTaken: totalTime, correct, wrong, skipped,
      });
    }

    setAnswers(ans);
    setTimeTaken(time);
    setScreen('results');
  }, [questions, difficulty, isAuthenticated, addHistoryEntry]);

  // Navigate via top nav tabs
  const navigate = (tab: 'home' | 'dashboard' | 'level') => setScreen(tab);

  // Which top nav tab is active
  const activeTab = screen === 'dashboard' ? 'dashboard' : screen === 'level' ? 'level' : 'home';

  // Show top nav on all pages except during active quiz
  const showNav = screen !== 'quiz';

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-slate-200 font-sans">
      {/* Top navigation bar */}
      {showNav && <TopNav active={activeTab} onNavigate={navigate} />}

      {/* Pages */}
      {screen === 'home' && <LandingPage onStart={() => setScreen('level')} />}
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'level' && <DifficultySelect onSelect={startQuiz} onBack={() => setScreen('home')} />}
      {screen === 'quiz' && (
        <QuizPage questions={questions} difficulty={difficulty} onFinish={finishQuiz} onQuit={() => setScreen('level')} />
      )}
      {screen === 'results' && (
        <ResultPage
          questions={questions} answers={answers} timeTaken={timeTaken} difficulty={difficulty}
          onRetry={() => startQuiz(difficulty)}
          onHome={() => setScreen('level')}
          onGoToLanding={() => setScreen('home')}
        />
      )}
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
