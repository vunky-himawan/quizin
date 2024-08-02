import { useQuiz } from "@/context/quizContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuizLayout from "@/layouts/quizLayout";
import { Link } from "react-router-dom";
import { decode } from "@/utils/decode";
import { v4 as uuidv4 } from "uuid";

/**
 * @component ResultPage
 * @description Halaman untuk menampilkan hasil kuis.
 * @returns {JSX.Element} - Halaman untuk menampilkan hasil kuis.
 */
const ResultPage = () => {
  // Mengambil konteks quiz.
  const { quizResult, setQuizResult } = useQuiz();

  // Menghapus hasil kuis ketika tombol back diklik.
  const handleBack = () => {
    setQuizResult(null);
  };

  return (
    <>
      <QuizLayout>
        <div className="col-span-4 flex flex-col gap-5 order-2 lg:order-1">
          {quizResult?.QuizAnswers.map((question, index) => (
            <Card key={`${question.question}-${index}`}>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {decode(question.question)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {question.answers.map((answer: string, ansIndex: number) => {
                    const key = `${
                      question.question
                    }-${answer}-${index}-${ansIndex}-${uuidv4()}`;
                    if (
                      question.userAnswer !== question.correct_answer &&
                      answer === question.userAnswer
                    ) {
                      return (
                        <>
                          <div
                            key={key}
                            className="bg-red-400 text-white p-2 rounded-lg text-center"
                          >
                            {decode(answer)}
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <div
                          key={key}
                          className={`${
                            answer === question.correct_answer
                              ? "bg-green-400 text-white "
                              : "bg-gray-100 text-black "
                          }  p-2 rounded-lg text-center`}
                        >
                          {decode(answer)}
                        </div>
                      );
                    }
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <div className="flex flex-col gap-5 sticky top-20 bg-white">
            <Link to="/user/dashboard" className="w-fit">
              <Button className="text-white" onClick={handleBack}>
                Back and Remove
              </Button>
            </Link>
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Total Incorrect Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl">
                  {quizResult?.totalIncorrectAnswers}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Total Correct Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl">
                  {quizResult?.totalCorrectAnswers}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Total Answered Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl">
                  {quizResult?.totalAnsweredQuestions}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </QuizLayout>
    </>
  );
};

export default ResultPage;
