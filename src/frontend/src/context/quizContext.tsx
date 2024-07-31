import { useToast } from "@/components/ui/use-toast";
import { QuestionService } from "@/service/question";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./authContext";
import QuizAnswer from "@/types/QuizAnswer";
import Category from "@/types/Category";
import QuizResult from "@/types/QuizResult";

const QuizContext = createContext({} as QuizContextType);

type QuizContextType = {
  quizQuestions: QuizAnswer[];
  categories: Category[];
  quizSession: number;
  generateQuestion: (difficulty: string, category: number) => void;
  generateCategories: () => void;
  handleFinish: () => void;
  quizResult: QuizResult | null;
  setQuizResult: (result: QuizResult | null) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
};

const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const { axiosRefreshToken } = useAuth();
  const [difficulty, setDifficulty] = useState<string>(
    localStorage.getItem("X-QUIZ-DIFFICULTY") || ""
  );
  const [quizSession, setQuizSession] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizAnswer[]>(
    localStorage.getItem("X-Quiz-Questions")
      ? JSON.parse(localStorage.getItem("X-Quiz-Questions") as string)
      : []
  );
  const { toast } = useToast();

  const generateCategories = async () => {
    const response = await QuestionService.getCategories({
      axiosRefreshToken,
    });

    setCategories(response.trivia_categories);
  };

  const generateQuestion = async (difficulty: string, category: number) => {
    toast({
      title: "Generating Question...",
      description: "Please wait...",
      duration: 2000,
      variant: "destructive",
    });

    const response = await QuestionService.getQuizQuestions({
      axiosRefreshToken,
      difficulty,
      category,
    });

    const sessionId = response?.quizSessionId;
    const quizQuestions = response?.mapped;

    setQuizSession(sessionId);
    setQuizQuestions(quizQuestions);

    localStorage.setItem("X-Quiz-Questions", JSON.stringify(quizQuestions));
    localStorage.setItem("X-Quiz-Session-Id", sessionId?.toString());
  };

  const handleFinish = async () => {
    const data = JSON.parse(localStorage.getItem("X-Quiz-Questions") || "[]");

    const response = await QuestionService.getQuizResult({
      axiosRefreshToken,
      data: data,
    });

    setQuizResult(response as QuizResult);

    localStorage.removeItem("X-Quiz-Session-Id");
    localStorage.removeItem("X-Quiz-Questions");
    localStorage.removeItem("X-CATEGORY-SELECTED");
    localStorage.removeItem("X-ELAPSED-TIME");
    localStorage.removeItem("X-QUIZ-DIFFICULTY");
  };

  const value: QuizContextType = {
    quizQuestions,
    quizSession,
    generateQuestion,
    handleFinish,
    quizResult,
    generateCategories,
    categories,
    setQuizResult,
    difficulty,
    setDifficulty,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizProvider;

export const useQuiz = () => {
  return useContext(QuizContext);
};
