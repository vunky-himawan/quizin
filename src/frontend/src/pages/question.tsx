import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/context/quizContext";
import { QuestionService } from "@/service/question";
import QuizAnswer from "@/types/QuizAnswer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { decode } from "@/utils/decode";
import { useAuth } from "@/context/authContext";

/**
 * @component QuestionPage
 * @description Halaman untuk menjawab pertanyaan kuis.
 * @returns {JSX.Element} - Halaman untuk menjawab pertanyaan kuis.
 */
const QuestionPage = () => {
  // Mengambil konteks autentikasi.
  const { username } = useAuth();

  // Mengambil konteks quiz.
  const { quizQuestions, handleFinish, quizResult, difficulty } = useQuiz();

  // Mengambil dan menyimpan nilai index.
  const [index, setIndex] = useState<number>(0);

  // Mengambil dan menyimpan nilai pertanyaan saat ini.
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<QuizAnswer>(
    quizQuestions[index]
  );

  // Mengambil dan menyimpan nilai waktu saat ini.
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Mengambil dan menyimpan nilai apakah sudah sampai pertanyaan terakhir.
  const [lastQuizQuestion, setLastQuizQuestion] = useState<boolean>(false);

  // Mengambil dan menyimpan nilai waktu.
  const [timer, setTimer] = useState<number>(0);

  // Mengambil dan menyimpan nilai waktu yang telah berlalu.
  const [elapsedTime, setElapsedTime] = useState<number>(
    localStorage.getItem(`X-ELAPSED-TIME-${username}`)
      ? Number(localStorage.getItem(`X-ELAPSED-TIME-${username}`))
      : 0
  );

  // Mengambil dan menyimpan nilai jawaban yang dipilih.
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  // Mengambil dan menyimpan nilai apakah kuis sudah dimulai.
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // Mengambil dan menyimpan nilai countdown sebelum memulai kuis.
  const [countdown, setCountdown] = useState<number>(3);

  // Inisialisasi fungsi untuk navigasi.
  const navigate = useNavigate();

  // Mengambil dan menyimpan jawaban yang telah dijawab.
  const answeredQuestion: QuizAnswer = {
    ...currentQuizQuestion,
    userAnswer: selectedAnswer,
  };

  /**
   * @function useEffect
   * @description Mengatur waktu dan menjalankan fungsi countdown.
   */
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

  /**
   * @function useEffect
   * @description Mengatur waktu dan menyimpan waktu yang telah berlalu.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(elapsedTime + 1000);
      localStorage.setItem(
        `X-ELAPSED-TIME-${username}`,
        elapsedTime.toString()
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isStarted, elapsedTime]);

  /**
   * @function useEffect
   * @description Mengatur index pertanyaan dan jawaban yang dipilih ketika pengguna melakukan resume.
   */
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

  /**
   * @function handleAnswer
   * @description Fungsi untuk menyimpan jawaban yang dipilih.
   * @param {string} answer - Jawaban yang dipilih.
   */
  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);

    if (selectedAnswer === answer) {
      answeredQuestion.userAnswer = "";
      setSelectedAnswer("");
    } else {
      answeredQuestion.userAnswer = answer;
      setSelectedAnswer(answer);
      QuestionService.updateAnsweredQuestionLocalStorage({
        question: currentQuizQuestion.question,
        answer,
        username,
      });
    }

    // Mengecek apakah pertanyaan terakhir.
    if (lastQuizQuestion) {
      await handleFinish();
    }

    // Menjalankan fungsi handleNext.
    handleNext();
  };

  /**
   * @function handleNext
   * @description Fungsi untuk untuk lanjut ke pertanyaan berikutnya.
   */
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

  // Mengambil fungsi untuk menyelesaikan kuis.
  const finishQuiz = async () => {
    await handleFinish();
  };

  /**
   * @function useEffect
   * @description Digunakan untuk mengarahkan ke halaman hasil kuis apabila kuis selesai.
   */
  useEffect(() => {
    if (quizResult) {
      navigate("/user/quiz/result");
    }
  }, [quizResult]);

  /**
   * @function renderer
   * @description Fungsi untuk merender waktu.
   * @param {number} hours - Waktu dalam jam.
   * @param {number} minutes - Waktu dalam menit.
   * @param {number} seconds - Waktu dalam detik.
   * @param {boolean} completed - Apakah waktu sudah berakhir.
   * @returns {JSX.Element} - Mengembalikan waktu yang telah berlalu.
   */
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
