// ============================================================
// DATA INDEX — Exports types, config, and getRandomQuestions()
// ============================================================

export type { Difficulty, QuestionType, Question } from './types';

// ---- Question type labels shown in the UI ----
export const typeLabels: Record<string, string> = {
  'rc': 'Reading Comprehension',
  'para-jumble': 'Para Jumble',
  'sentence-correction': 'Sentence Correction',
  'vocabulary': 'Vocabulary',
  'grammar': 'Grammar',
  'critical-reasoning': 'Critical Reasoning',
  'fill-in-blanks': 'Fill in the Blanks',
};

// ---- Difficulty settings ----
export const difficultyConfig: Record<string, { label: string; color: string; bg: string; timePerQuestion: number; questionsPerSession: number }> = {
  easy:   { label: 'Easy',      color: 'from-emerald-500 to-green-600',  bg: 'bg-emerald-500', timePerQuestion: 45, questionsPerSession: 10 },
  medium: { label: 'Medium',    color: 'from-amber-500 to-orange-600',   bg: 'bg-amber-500',   timePerQuestion: 45, questionsPerSession: 10 },
  hard:   { label: 'Hard',      color: 'from-red-500 to-rose-600',       bg: 'bg-red-500',     timePerQuestion: 45, questionsPerSession: 10 },
  cat:    { label: 'CAT Level', color: 'from-violet-500 to-purple-700',  bg: 'bg-violet-500',  timePerQuestion: 45, questionsPerSession: 10 },
};

// ---- Import question banks ----
import { Question } from './types';
import { easyQuestions } from './easy';
import { mediumQuestions } from './medium';
import { hardQuestions } from './hard';
import { catQuestions } from './catLevel';

const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions, ...catQuestions];

// ---- Shuffle options randomly so correct answer position is unpredictable ----
function shuffleOptions(q: Question): Question {
  const correctText = q.options[q.correctAnswer];
  const indices = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newOptions = indices.map(i => q.options[i]);
  return { ...q, options: newOptions, correctAnswer: newOptions.indexOf(correctText) };
}

// ---- Get N random questions for a given difficulty ----
export function getRandomQuestions(
  difficulty: string,
  topic: string,
  count: number
): Question[] {

  const pool = allQuestions.filter(q => {

    if (topic === 'mixed') {
      return q.difficulty === difficulty;
    }

    return (
      q.difficulty === difficulty &&
      q.type === topic
    );
  });

  const shuffled = [...pool].sort(
    () => Math.random() - 0.5
  );

  return shuffled
    .slice(0, count)
    .map(shuffleOptions);
}

