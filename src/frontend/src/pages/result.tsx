import { useQuiz } from "@/context/quizContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuizLayout from "@/layouts/quizLayout";
import { Link } from "react-router-dom";
import { decode } from "@/utils/decode";

const ResultPage = () => {
  const { quizResult, setQuizResult } = useQuiz();

  const handleBack = () => {
    localStorage.removeItem("quizResult");
    localStorage.removeItem("difficulty");
    setQuizResult(null);
  };

  return (
    <>
      <QuizLayout>
        <div className="col-span-4 flex flex-col gap-5">
          {quizResult?.QuizAnswers.map((question) => (
            <Card key={question.question}>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {decode(question.question)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {question.answers.map((answer: string) => {
                    if (
                      question.userAnswer !== question.correct_answer &&
                      answer === question.userAnswer
                    ) {
                      return (
                        <>
                          <div
                            key={answer}
                            className="bg-red-400 text-white p-2 rounded-lg text-center"
                          >
                            {decode(answer)}
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <div
                          key={answer}
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
        <div>
          <div className="flex flex-col gap-5 sticky top-20 bg-white">
            <Link to="/user/dashboard">
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
