interface Quiz {
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
}

export default Quiz;
