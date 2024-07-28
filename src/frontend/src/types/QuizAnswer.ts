interface QuizAnswer {
  userAnswer: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  answers: string[];
  point: number | null;
  isCorrect: boolean | null;
}

export default QuizAnswer;
