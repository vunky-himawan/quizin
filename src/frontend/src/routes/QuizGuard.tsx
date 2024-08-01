import { useQuiz } from "@/context/quizContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * @component QuizGuard
 * @description Guard untuk memastikan pengguna hanya bisa mengakses halaman /user/quiz jika soal quiz sudah tersedia.
 * @returns {JSX.Element} - Mengembalikan halaman yang akan ditampilkan sesuai dengan action.
 */
export const QuizGuard = () => {
  const { quizQuestions } = useQuiz();

  if (!quizQuestions || quizQuestions.length === 0) {
    return <Navigate to="/user/dashboard" />;
  }

  return <Outlet />;
};
