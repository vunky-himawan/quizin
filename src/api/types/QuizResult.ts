import QuizAnswer from "./QuizAnswer";

interface QuizResult {
  totalQuestions: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  totalAnsweredQuestions: number;
  percentageCorrectAnswers: number;
  score: number;
  QuizAnswers: QuizAnswer[];
}

export default QuizResult;
