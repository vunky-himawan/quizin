import { Request, Response } from "express";
import axios from "axios";
import QuizAnswer from "../types/QuizAnswer";
import { QuestionService } from "../service/QuestionService";
import Quiz from "../types/Quiz";
import { db } from "../database";
import { quizAnswer, quizSessions, users } from "../database/schema";
import { eq } from "drizzle-orm";
import QuizResult from "../types/QuizResult";

/**
 * @function getQuizQuestion
 * @description Fungsi untuk mendapatkan pertanyaan quiz dari API OpenTDB.
 * @param {Request} req - Permintaan HTTP yang berisi token dan data pertanyaan quiz seperti jumlah pertanyaan, kategori, dan kesulitan.
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa data pertanyaan quiz yang sudah di-map.
 */
const getQuizQuestion = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const difficulty = req.body.difficulty;
    const amount = req.body.amount;
    const category = req.body.category;
    let token = req.headers["x-quiz-token"] as string;

    if (!token || !refreshToken) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Unauthorized",
      });
    }

    let quizQuestions = await QuestionService.getQuizQuestions({
      difficulty,
      amount,
      category,
      token,
    });

    /* Mengambil user dengan refreshToken */
    const user = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));

    if (quizQuestions.data.response_code === 3) {
      token = await QuestionService.getNewQuizToken();

      // sleep 5s
      await new Promise((resolve) => setTimeout(resolve, 5000));

      quizQuestions = await QuestionService.getQuizQuestions({
        difficulty,
        amount,
        category,
        token,
      });
    }

    if (quizQuestions.data.response_code === 4) {
      token = await QuestionService.resetToken({ token });

      // sleep 5s
      await new Promise((resolve) => setTimeout(resolve, 5000));

      quizQuestions = await QuestionService.getQuizQuestions({
        difficulty,
        amount,
        category,
        token,
      });
    }

    if (
      quizQuestions.data.response_code === 5 ||
      quizQuestions.data.response_code === 1
    ) {
      return res.status(404).json({
        error: "not_found",
        message: "Quiz questions is not found",
      });
    }

    if (quizQuestions.data.results.length === 0) {
      return res.status(404).json({
        error: "not_found",
        message: "Quiz questions is not found",
      });
    }

    /* Melakukan mapping dari tipe Question ke QuizAnswer */
    const quizMapped: QuizAnswer[] = quizQuestions.data.results.map(
      (question: Quiz) => {
        const answers: string[] = QuestionService.randomAnswers({
          incorect_answers: question.incorrect_answers,
          correct_answer: question.correct_answer,
          type: question.type,
        });

        return {
          userAnswer: "",
          type: question.type,
          difficulty: question.difficulty,
          category: question.category,
          question: question.question,
          answers,
          correct_answer: "",
          point: null,
          isCorrect: null,
        };
      }
    );

    /* Memasukkan ke dalam tabel quiz_sessions dan quiz_answer */
    await db.transaction(async (tx) => {
      const quizSession = await tx.insert(quizSessions).values({
        userId: user[0].id,
        totalQuestions: quizQuestions.data.results.length,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        score: 0,
      });

      quizQuestions.data.results.forEach(async (question: Quiz) => {
        await tx.insert(quizAnswer).values({
          quizSessionId: quizSession[0].insertId,
          question: question.question,
          correctAnswer: question.correct_answer,
        });
      });

      return res.status(200).json({ mapped: quizMapped, quizSession });
    });
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal server error",
    });
  }
};

/**
 * @function getQuizToken
 * @description Fungsi untuk mendapatkan token quiz dari API OpenTDB.
 * @param {Request} req - Permintaan HTTP yang berisi token refresh.
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa token quiz.
 */
const getQuizToken = async (req: Request, res: Response) => {
  try {
    const quizToken = await axios.get(
      "https://opentdb.com/api_token.php?command=request"
    );

    res.json({
      quizToken: quizToken.data.token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

/**
 * @function getQuizResult
 * @description Fungsi untuk mendapatkan hasil quiz dan melakukan validasi jawaban pengguna.
 * @param {Request} req - Permintaan HTTP yang berisi token quiz, id quiz sesi, dan data pertanyaan quiz.
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa hasil quiz dan jawaban yang valid.
 */
const getQuizResult = async (req: Request, res: Response) => {
  try {
    const quizSessionId = req.body.quizSessionId;
    const data = req.body.data;

    if (!quizSessionId) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Unauthorized",
      });
    }

    /* Inisialisasi variabel untuk menampilkan hasil quiz */
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let score = 0;

    /* Inisialisasi variabel untuk menyimpan quiz yang sudah di-validasi */
    let quizAnswerUpdated: QuizAnswer[] = [];

    /* Memulai transaksi database */
    await db.transaction(async (tx) => {
      /* Mengambil semua jawaban quiz dari database berdasarkan id quiz sesi */
      const quizAnswers = await db
        .select()
        .from(quizAnswer)
        .where(eq(quizAnswer.quizSessionId, quizSessionId));

      data.forEach(async (question: QuizAnswer, index: number) => {
        /* Mengambil jawaban yang benar */
        const correct_answer = quizAnswers[index].correctAnswer;

        /* Mengambil jawaban pengguna */
        const userAnswer = question.userAnswer;

        /* Melakukan validasi jawaban pengguna */
        const correctedAnswer = QuestionService.correctedAnswer({
          totalQuestions: data.length,
          correct_answer,
          userAnswer,
        });

        /* Menambahkan jawaban yang sudah di-validasi ke dalam array */
        quizAnswerUpdated.push({
          ...question,
          correct_answer,
          userAnswer,
          isCorrect: correctedAnswer.isCorrect,
          point: correctedAnswer.point,
        });

        if (correctedAnswer.isCorrect) {
          correctAnswersCount++;
          score += correctedAnswer.point;
        } else {
          incorrectAnswersCount++;
        }
      });

      /* Membuat objek hasil quiz */
      const quizResult: QuizResult = {
        totalQuestions: data.length,
        totalAnsweredQuestions: correctAnswersCount + incorrectAnswersCount,
        totalCorrectAnswers: correctAnswersCount,
        totalIncorrectAnswers: incorrectAnswersCount,
        percentageCorrectAnswers: correctAnswersCount / data.length,
        score,
        QuizAnswers: quizAnswerUpdated,
      };

      /* Memperbarui jumlah jawaban yang benar dan salah serta skor pada tabel quiz_sessions */
      await tx
        .update(quizSessions)
        .set({
          totalCorrectAnswers: correctAnswersCount,
          totalIncorrectAnswers: incorrectAnswersCount,
          score,
        })
        .where(eq(quizSessions.id, quizSessionId));

      return res.status(200).json({ quizResult });
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @function getCategories
 * @description Fungsi untuk mendapatkan daftar kategori dari API OpenTDB.
 * @param {Request} req - Permintaan HTTP.
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa daftar kategori quiz dari API OpenTDB.
 */
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await axios.get("https://opentdb.com/api_category.php");

    res.json({ categories: categories.data.trivia_categories });
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

/**
 * @function QuizController
 * @description Mengikuti semua fungsi dari controller quiz.
 * @returns {Object} - Mengembalikan semua fungsi dari controller quiz.
 */
export const QuizController = {
  getQuizQuestion,
  getQuizToken,
  getQuizResult,
  getCategories,
};
