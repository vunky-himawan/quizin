import { useQuiz } from "@/context/quizContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedResultQuiz = () => {
  const { quizResult } = useQuiz();

  if (!quizResult) {
    return <Navigate to="/user/dashboard" />;
  }

  return <Outlet />;
};
