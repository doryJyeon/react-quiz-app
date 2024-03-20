export interface IUserAnswer {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

export interface IQuestion {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  totalQuestions: number;
  quesrionNumber: number;
}