import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuiz } from "@/context/quizContext";
import { QuestionService } from "@/service/question";
import QuizAnswer from "@/types/QuizAnswer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { decode } from "@/utils/decode";

const QuestionPage = () => {
  const { quizQuestions, handleFinish, quizResult, difficulty } = useQuiz();
  const [index, setIndex] = useState<number>(0);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<QuizAnswer>(
    quizQuestions[index]
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [lastQuizQuestion, setLastQuizQuestion] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(
    localStorage.getItem("X-ELAPSED-TIME")
      ? Number(localStorage.getItem("X-ELAPSED-TIME"))
      : 0
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const navigate = useNavigate();
  const answeredQuestion: QuizAnswer = {
    ...currentQuizQuestion,
    userAnswer: selectedAnswer,
  };

  useEffect(() => {
    if (difficulty === "easy") {
      setTimer(15 * 60 * 1000 - elapsedTime);
    } else if (difficulty === "medium") {
      setTimer(20 * 60 * 1000 - elapsedTime);
    } else if (difficulty === "hard") {
      setTimer(25 * 60 * 1000 - elapsedTime);
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setIsStarted(true);
          setCurrentDate(new Date());
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [quizQuestions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(elapsedTime + 1000);
      localStorage.setItem("X-ELAPSED-TIME", elapsedTime.toString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isStarted, elapsedTime]);

  useEffect(() => {
    const nextIndex = index + 1;

    if (
      currentQuizQuestion.userAnswer !== "" &&
      nextIndex < quizQuestions.length
    ) {
      setIndex(nextIndex);
      setCurrentQuizQuestion(quizQuestions[nextIndex]);
    }
  }, [currentQuizQuestion, index]);

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);

    if (lastQuizQuestion) {
      await handleFinish();
    }

    if (selectedAnswer === answer) {
      answeredQuestion.userAnswer = "";
      setSelectedAnswer("");
    } else {
      answeredQuestion.userAnswer = answer;
      setSelectedAnswer(answer);
      QuestionService.updateAnsweredQuestionLocalStorage({
        question: currentQuizQuestion.question,
        answer,
      });
    }

    handleNext();
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);

    if (nextIndex < quizQuestions.length) {
      setCurrentQuizQuestion(quizQuestions[nextIndex]);
      setSelectedAnswer("");
      setLastQuizQuestion(nextIndex === quizQuestions.length - 1);
    } else {
      setLastQuizQuestion(true);
    }
  };

  const finishQuiz = async () => {
    await handleFinish();
  };

  useEffect(() => {
    if (quizResult) {
      navigate("/user/quiz/result");
    }
  }, [quizResult]);

  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      finishQuiz();
    } else {
      return (
        <span className="text-center">
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto h-full gap-5 w-full pt-24 p-5 grid grid-cols-5">
        {!isStarted && (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-center font-semibold text-2xl">
                Quiz will start in {countdown} seconds
              </h1>
            </CardContent>
          </Card>
        )}
        {isStarted && (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="text-center text-2xl select-none">
                {decode(currentQuizQuestion.question)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {currentQuizQuestion.answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(answer)}
                    className={`${
                      selectedAnswer === answer
                        ? "bg-green-500 text-white"
                        : "bg-white text-black"
                    }  hover:bg-green-500 hover:text-white select-none`}
                  >
                    {decode(answer)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Timer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {timer > 0 && isStarted && (
                <Countdown
                  className="text-center"
                  date={currentDate.getTime() + timer}
                  renderer={renderer}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl">
                {index} question answered out of {quizQuestions.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>
    </>
  );
};

export default QuestionPage;
