import { Question } from './types';

import vocabulary from './varc/easy/vocabulary.json';
import grammar from './varc/easy/grammar.json';
import rc from './varc/easy/rc.json';
import paraJumble from './varc/easy/para-jumble.json';
import criticalReasoning from './varc/easy/critical-reasoning.json';

export const easyQuestions: Question[] = [
  ...vocabulary,
  ...grammar,
  ...rc,
  ...paraJumble,
  ...criticalReasoning,
];