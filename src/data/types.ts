// ============================================================
// TYPES — Only type definitions, no runtime code
// ============================================================

export type Difficulty = string;
export type QuestionType = 'rc' | 'para-jumble' | 'sentence-correction' | 'vocabulary' | 'grammar' | 'critical-reasoning' | 'fill-in-blanks';

export interface Question {
  id: number;
  type: QuestionType;
  difficulty: string;
  passage?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  source?: string;
}
