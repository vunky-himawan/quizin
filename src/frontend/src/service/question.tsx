import QuizAnswer from "@/types/QuizAnswer";
import axios, { AxiosInstance } from "axios";
axios.defaults.withCredentials = true;

const getQuizToken = async ({
  axiosRefreshToken,
}: {
  axiosRefreshToken: AxiosInstance;
}) => {
  try {
    const response = await axiosRefreshToken.get(
      "http://localhost:3000/quiz/token",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const token = response.data.quizToken;

    return token;
  } catch (error) {
    console.log(error);
  }
};

const getQuizQuestions = async ({
  axiosRefreshToken,
  difficulty,
  category,
}: {
  axiosRefreshToken: AxiosInstance;
  difficulty: string;
  category: number;
}) => {
  try {
    const token = await getQuizToken({ axiosRefreshToken });
    let amount = 10;

    switch (difficulty) {
      case "easy":
        amount = 10;
        break;
      case "medium":
        amount = 25;
        break;
      case "hard":
        amount = 50;
        break;
    }

    if (!token) {
      return null;
    }

    const response = await axiosRefreshToken.post(
      "http://localhost:3000/quiz/questions",
      {
        difficulty,
        amount,
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Quiz-Token": token,
        },
      }
    );

    return {
      quizSessionId: response.data.quizSession[0].insertId,
      mapped: response.data.mapped,
    };
  } catch (error) {
    console.log(error);
  }
};

const getCategories = async ({
  axiosRefreshToken,
}: {
  axiosRefreshToken: AxiosInstance;
}) => {
  try {
    const response = await axiosRefreshToken.get(
      "http://localhost:3000/quiz/categories",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getQuizResult = async ({
  axiosRefreshToken,
  data,
}: {
  axiosRefreshToken: AxiosInstance;
  data: QuizAnswer[];
}) => {
  try {
    const response = await axiosRefreshToken.post(
      "http://localhost:3000/quiz/answer",
      {
        data,
        quizSessionId: localStorage.getItem("X-Quiz-Session-Id"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Quiz-Token": localStorage.getItem("quizToken"),
        },
      }
    );

    return response.data.quizResult;
  } catch (error) {
    console.log(error);
  }
};

const filterQuestionsFromLocalStorage = (): QuizAnswer[] => {
  const storedQuestions = localStorage.getItem("X-Quiz-Questions");

  if (!storedQuestions) {
    return [];
  }

  const questions = JSON.parse(storedQuestions);

  const filteredQuestions = questions.filter(
    (q: QuizAnswer) => q.userAnswer === ""
  );

  return filteredQuestions;
};

const updateAnsweredQuestionLocalStorage = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const questions = localStorage.getItem("X-Quiz-Questions");

  if (!questions) {
    return;
  }

  const quiz = JSON.parse(questions);

  const updatedQuestions = quiz.map((q: QuizAnswer) => {
    if (q.question === question) {
      return { ...q, userAnswer: answer };
    }

    return q;
  });

  localStorage.setItem("X-Quiz-Questions", JSON.stringify(updatedQuestions));
};

const getQuestionAnsweredCount = (questions: QuizAnswer[]) => {
  return questions.filter((q: QuizAnswer) => q.userAnswer !== "").length;
};

export const QuestionService = {
  getQuizToken,
  getQuizQuestions,
  getQuizResult,
  getCategories,
  filterQuestionsFromLocalStorage,
  updateAnsweredQuestionLocalStorage,
  getQuestionAnsweredCount,
};
