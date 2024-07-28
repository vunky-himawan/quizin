const randomAnswers = ({
  incorect_answers,
  correct_answer,
  type,
}: {
  incorect_answers: string[];
  correct_answer: string;
  type: "multiple" | "boolean";
}) => {
  const answers: string[] = [...incorect_answers, correct_answer];

  if (type !== "boolean") {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
  }

  return answers;
};

type correctedAnswerReturn = {
  isCorrect: boolean;
  point: number;
};

const correctedAnswer = ({
  correct_answer,
  totalQuestions,
  userAnswer,
}: {
  totalQuestions: number;
  correct_answer: string;
  userAnswer: string;
}): correctedAnswerReturn => {
  try {
    const isCorrect = correct_answer === userAnswer;
    const point = isCorrect ? 100 / totalQuestions : 0;

    return {
      isCorrect,
      point,
    };
  } catch (error) {
    console.log(error);
    return {
      isCorrect: false,
      point: 0,
    };
  }
};

export const QuestionService = {
  randomAnswers,
  correctedAnswer,
};
