import QuizAnswer from "@/types/QuizAnswer";
import axios, { AxiosInstance } from "axios";
axios.defaults.withCredentials = true;

/**
 * @function getQuizToken
 * @description Mengambil token quiz dari server.
 * @param {AxiosInstance} axiosRefreshToken - Axios instance yang digunakan untuk mengambil token quiz.
 * @returns {Promise<AxiosResponse<string>>} - Promise yang mengembalikan token quiz.
 */
const getQuizToken = async ({
  axiosRefreshToken,
}: {
  axiosRefreshToken: AxiosInstance;
}) => {
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
};

/**
 * @function getQuizQuestions
 * @description Mengambil pertanyaan quiz dari server.
 * @param {AxiosInstance} axiosRefreshToken - Axios instance yang digunakan untuk mengambil pertanyaan quiz.
 * @param {string} difficulty - Tingkat kesulitan pertanyaan quiz.
 * @param {number} category - Kategori pertanyaan quiz.
 * @returns {Promise<AxiosResponse<any>>} - Promise yang mengembalikan pertanyaan quiz.
 */
const getQuizQuestions = async ({
  axiosRefreshToken,
  difficulty,
  category,
  token,
}: {
  axiosRefreshToken: AxiosInstance;
  difficulty: string;
  category: number;
  token: string;
}) => {
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
};

/**
 * @function getCategories
 * @description Mengambil kategori pertanyaan quiz dari server.
 * @param {AxiosInstance} axiosRefreshToken - Axios instance yang digunakan untuk mengambil kategori pertanyaan quiz.
 * @returns {Promise<AxiosResponse<any>>} - Promise yang mengembalikan kategori pertanyaan quiz.
 */
const getCategories = async ({
  axiosRefreshToken,
}: {
  axiosRefreshToken: AxiosInstance;
}) => {
  const response = await axiosRefreshToken.get(
    "http://localhost:3000/quiz/categories",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response;
};

/**
 * @function getQuizResult
 * @description Mengambil hasil quiz dari server.
 * @param {AxiosInstance} axiosRefreshToken - Axios instance yang digunakan untuk mengambil hasil quiz.
 * @param {QuizAnswer[]} data - Data pertanyaan quiz yang telah dijawab.
 * @returns {Promise<AxiosResponse<any>>} - Promise yang mengembalikan hasil quiz.
 */
const getQuizResult = async ({
  axiosRefreshToken,
  data,
  username,
}: {
  axiosRefreshToken: AxiosInstance;
  data: QuizAnswer[];
  username: string;
}) => {
  try {
    const response = await axiosRefreshToken.post(
      "http://localhost:3000/quiz/answer",
      {
        data,
        quizSessionId: localStorage.getItem(`X-Quiz-Session-Id-${username}`),
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

/**
 * @function updateAnsweredQuestionLocalStorage
 * @description Menambahkan data pertanyaan quiz yang telah dijawab ke local storage.
 * @param {string} question - Pertanyaan yang telah dijawab.
 * @param {string} answer - Jawaban pertanyaan yang telah dijawab.
 */
const updateAnsweredQuestionLocalStorage = ({
  question,
  answer,
  username,
}: {
  question: string;
  answer: string;
  username: string;
}) => {
  const questions = localStorage.getItem(`X-Quiz-Questions-${username}`);

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

  localStorage.setItem(
    `X-Quiz-Questions-${username}`,
    JSON.stringify(updatedQuestions)
  );
};

/**
 * @function getQuestionAnsweredCount
 * @description Mengembalikan jumlah pertanyaan quiz yang telah dijawab.
 * @param {QuizAnswer[]} questions - Data pertanyaan quiz.
 * @returns {number} - Jumlah pertanyaan quiz yang telah dijawab.
 */
const getQuestionAnsweredCount = (questions: QuizAnswer[]) => {
  return questions.filter((q: QuizAnswer) => q.userAnswer !== "").length;
};

/**
 * @constant QuestionService
 * @description Objek yang menampung fungsi yang digunakan untuk mengambil data dari server.
 */
export const QuestionService = {
  getQuizToken,
  getQuizQuestions,
  getQuizResult,
  getCategories,
  updateAnsweredQuestionLocalStorage,
  getQuestionAnsweredCount,
};
