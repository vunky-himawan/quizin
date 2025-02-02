import { QuestionService } from "@/service/question";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./authContext";
import QuizAnswer from "@/types/QuizAnswer";
import Category from "@/types/Category";
import QuizResult from "@/types/QuizResult";
import axios from "axios";

const QuizContext = createContext({} as QuizContextType);

type QuizContextType = {
  quizQuestions: QuizAnswer[];
  setQuizQuestions: (questions: QuizAnswer[]) => void;
  categories: Category[];
  quizSession: number;
  generateQuestion: (difficulty: string, category: number) => void;
  generateCategories: () => void;
  handleFinish: () => void;
  quizResult: QuizResult | null;
  setQuizResult: (result: QuizResult | null) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  quizError: string;
  setQuizError: (error: string) => void;
  quizToken: string;
  getQuizToken: () => void;
};

/**
 * @function QuizProvider
 * @description Menyediakan quiz konteks.
 * @param {React.ReactNode} children - Komponen child yang akan menerima quiz konteks.
 * @returns {JSX.Element} - Penyedia konteks quiz yang membungkus komponen child.
 */
const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  // Mengambil konteks autentikasi.
  const { axiosRefreshToken, username } = useAuth();

  // Mengambil dan menyimpan nilai difficulty dari localStorage.
  const [difficulty, setDifficulty] = useState<string>(
    localStorage.getItem(`X-QUIZ-DIFFICULTY-${username}`) ?? ""
  );

  // Mengambil dan menyimpan nilai quizToken dari localStorage.
  const [quizToken, setQuizToken] = useState<string>(
    localStorage.getItem("X-QUIZ-TOKEN") ?? ""
  );

  // Mengambil dan menyimpan nilai quizSession dari localStorage.
  const [quizSession, setQuizSession] = useState<number>(0);

  // Mengambil dan menyimpan nilai quizResult dari localStorage.
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Mengambil dan menyimpan nilai categories dari localStorage.
  const [categories, setCategories] = useState<Category[]>([]);

  // Mengambil dan menyimpan nilai quizQuestions dari localStorage.
  const [quizQuestions, setQuizQuestions] = useState<QuizAnswer[]>(
    localStorage.getItem(`X-Quiz-Questions-${username}`)
      ? JSON.parse(
          localStorage.getItem(`X-Quiz-Questions-${username}`) as string
        )
      : []
  );

  // Mengambil menyimpan error dari quiz.
  const [quizError, setQuizError] = useState<string>("");

  /**
   * @function generateCategories
   * @description Fungsi untuk mengambil daftar kategori quiz.
   */
  const generateCategories = async () => {
    try {
      const response = await QuestionService.getCategories({
        axiosRefreshToken,
      });

      setCategories(response?.data.categories ?? []);
    } catch (error) {
      setQuizError(error as string);
    }
  };

  /**
   * @function generateQuestion
   * @description Fungsi untuk mengambil pertanyaan quiz.
   * @param {string} difficulty - Tingkat kesulitan quiz.
   * @param {number} category - Kategori quiz.
   */
  const generateQuestion = async (difficulty: string, category: number) => {
    try {
      const response = await QuestionService.getQuizQuestions({
        axiosRefreshToken,
        difficulty,
        category,
        token: quizToken,
      });

      const sessionId = response?.quizSessionId;
      const quizQuestions = response?.mapped;

      setQuizSession(sessionId);
      setQuizQuestions(quizQuestions);

      localStorage.setItem(
        `X-Quiz-Questions-${username}`,
        JSON.stringify(quizQuestions)
      );
      localStorage.setItem(
        `X-Quiz-Session-Id-${username}`,
        sessionId?.toString()
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data.message;
      } else {
        throw "An unexpected error occurred";
      }
    }
  };

  /**
   * @function handleFinish
   * @description Fungsi untuk mengakhiri quiz dan mengambil hasil quiz.
   */
  const handleFinish = async () => {
    const data = JSON.parse(
      localStorage.getItem(`X-Quiz-Questions-${username}`) || "[]"
    );

    const response = await QuestionService.getQuizResult({
      axiosRefreshToken,
      data: data,
      username,
    });

    setQuizResult(response as QuizResult);
    setQuizError("");

    localStorage.removeItem(`X-Quiz-Session-Id-${username}`);
    localStorage.removeItem(`X-Quiz-Questions-${username}`);
    localStorage.removeItem(`X-CATEGORY-SELECTED-${username}`);
    localStorage.removeItem(`X-ELAPSED-TIME-${username}`);
    localStorage.removeItem(`X-QUIZ-DIFFICULTY-${username}`);
  };

  /**
   * @function getQuizToken
   * @description Fungsi untuk mengambil token quiz.
   */
  const getQuizToken = async () => {
    const response = await QuestionService.getQuizToken({
      axiosRefreshToken,
    });

    setQuizToken(response);
    localStorage.setItem("X-QUIZ-TOKEN", response);
  };

  // Mengembalikan nilai dari konteks quiz.
  const value: QuizContextType = {
    quizQuestions,
    setQuizQuestions,
    quizSession,
    generateQuestion,
    handleFinish,
    quizResult,
    getQuizToken,
    generateCategories,
    quizToken,
    quizError,
    categories,
    setQuizResult,
    difficulty,
    setDifficulty,
    setQuizError,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizProvider;

/**
 * @function useQuiz
 * @description Hook untuk menggunakan konteks quiz.
 * @returns {QuizContextType} - Mengembalikan konteks quiz.
 */
export const useQuiz = () => {
  return useContext(QuizContext);
};
