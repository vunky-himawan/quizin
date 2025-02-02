import { useQuiz } from "@/context/quizContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * @component ProtectedResultQuiz
 * @description Guard untuk memastikan pengguna hanya bisa mengakses halaman /quiz/result jika pengguna telah selesaikan quiz.
 * @returns {JSX.Element} - Mengembalikan halaman yang akan ditampilkan sesuai dengan action.
 */
export const ProtectedResultQuiz = () => {
  const { quizResult } = useQuiz();

  if (!quizResult) {
    return <Navigate to="/user/dashboard" />;
  }

  return <Outlet />;
};
