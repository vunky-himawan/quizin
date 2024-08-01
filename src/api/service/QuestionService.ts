import axios from "axios";

/**
 * @function randomAnswers
 * @description Fungsi untuk mengacak jawaban yang benar dan jawaban yang salah.
 * @param {Object} param - Parameter yang berisi data jawaban yang tidak benar dan benar, dan tipe pertanyaan.
 * @returns {string[]} - Mengembalikan jawaban yang acak.
 */
const randomAnswers = ({
  incorect_answers,
  correct_answer,
  type,
}: {
  incorect_answers: string[];
  correct_answer: string;
  type: "multiple" | "boolean";
}) => {
  const answers: string[] = [...incorect_answers, correct_answer];

  if (type !== "boolean") {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
  }

  return answers;
};

/* Return type untuk fungsi correctedAnswer */
type correctedAnswerReturn = {
  isCorrect: boolean;
  point: number;
};

/**
 * @function correctedAnswer
 * @description Fungsi untuk mengecek jawaban pengguna dan menghitung skor.
 * @param {Object} param - Parameter yang berisi data jawaban yang benar, jumlah pertanyaan, dan jawaban pengguna.
 * @returns {correctedAnswerReturn} - Mengembalikan hasil validasi jawaban pengguna.
 */
const correctedAnswer = ({
  correct_answer,
  totalQuestions,
  userAnswer,
}: {
  totalQuestions: number;
  correct_answer: string;
  userAnswer: string;
}): correctedAnswerReturn => {
  try {
    const isCorrect = correct_answer === userAnswer;
    const point = isCorrect ? 100 / totalQuestions : 0;

    return {
      isCorrect,
      point,
    };
  } catch (error) {
    console.log(error);
    return {
      isCorrect: false,
      point: 0,
    };
  }
};

/**
 * @function getNewQuizToken
 * @description Fungsi untuk mendapatkan token quiz baru.
 * @returns {Promise<string>} - Mengembalikan token quiz baru.
 */
const getNewQuizToken = async (): Promise<string> => {
  const response = await axios.post(
    "https://opentdb.com/api_token.php?command=request"
  );
  return response.data.token;
};

/**
 * @function resetToken
 * @description Fungsi untuk reset token quiz.
 * @param {Object} param - Parameter yang berisi token quiz.
 * @returns {Promise<string>} - Mengembalikan token quiz baru.
 */
const resetToken = async ({ token }: { token: string }): Promise<string> => {
  const response = await axios.post(
    `https://opentdb.com/api_token.php?command=reset&token=${token}`
  );
  return response.data.token;
};

/**
 * @function getQuizQuestions
 * @description Fungsi untuk mendapatkan pertanyaan quiz dari API OpenTDB.
 * @param {Object} param - Parameter yang berisi data pertanyaan quiz (kesulitan, jumlah pertanyaan, kategori, dan token).
 * @returns {Promise<AxiosResponse<any, any>>} - Mengembalikan respons dari API OpenTDB.
 */
const getQuizQuestions = async ({
  difficulty,
  amount,
  category,
  token,
}: {
  difficulty: string;
  amount: number;
  category: number;
  token: string;
}) => {
  const response = await axios.get(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${token}`
  );

  return response;
};

/**
 * @function QuestionService
 * @description Mengikuti semua fungsi dari service question.
 * @returns {Object} - Mengembalikan semua fungsi dari service question.
 */
export const QuestionService = {
  randomAnswers,
  correctedAnswer,
  getNewQuizToken,
  resetToken,
  getQuizQuestions,
};
