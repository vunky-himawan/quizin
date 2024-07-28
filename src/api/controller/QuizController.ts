import { Request, Response } from "express";
import axios from "axios";
import QuizAnswer from "../types/QuizAnswer";
import { QuestionService } from "../service/QuestionService";
import Quiz from "../types/Quiz";
import { db } from "../database";
import { quizAnswer, quizSessions, users } from "../database/schema";
import { eq } from "drizzle-orm";
import QuizResult from "../types/QuizResult";

const getQuizQuestion = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const difficulty = req.body.difficulty;
    const amount = req.body.amount;
    const category = req.body.category;

    if (!refreshToken) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Unauthorized",
      });
    }

    /* Mengambil user dengan refreshToken */
    const user = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));

    const token = req.headers["x-quiz-token"];

    if (!token) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Unauthorized",
      });
    }

    const quizQuestion = await axios.get(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${token}`
    );

    if (quizQuestion.data.results.length === 0) {
      return res.status(404).json({
        error: "not_found",
        message: "Not Found",
      });
    }

    /* Mengubah tipe Question ke QuizAnswer */
    const quizMapped: QuizAnswer[] = quizQuestion.data.results.map(
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
        totalQuestions: quizQuestion.data.results.length,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        score: 0,
      });

      quizQuestion.data.results.forEach(async (question: Quiz) => {
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
      message: "Internal Server Error",
    });
  }
};

const getQuizToken = async (req: Request, res: Response) => {
  try {
    const quizToken = await axios.get(
      "https://opentdb.com/api_token.php?command=request"
    );

    res.cookie("quizToken", quizToken.data.token, {
      httpOnly: true,
      maxAge: 6 * 3600,
    });

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

    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let score = 0;
    let totalAnsweredQuestions = 0;
    let quizAnswerUpdated: QuizAnswer[] = [];

    await db.transaction(async (tx) => {
      const quizAnswers = await db
        .select()
        .from(quizAnswer)
        .where(eq(quizAnswer.quizSessionId, quizSessionId));

      data.forEach(async (question: QuizAnswer, index: number) => {
        const correct_answer = quizAnswers[index].correctAnswer;
        const userAnswer = question.userAnswer;

        if (userAnswer !== "") {
          totalAnsweredQuestions++;
        }

        const correctedAnswer = QuestionService.correctedAnswer({
          totalQuestions: data.length,
          correct_answer,
          userAnswer,
        });

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

      const quizResult: QuizResult = {
        totalQuestions: data.length,
        totalAnsweredQuestions,
        totalCorrectAnswers: correctAnswersCount,
        totalIncorrectAnswers: incorrectAnswersCount,
        percentageCorrectAnswers: correctAnswersCount / data.length,
        score,
        QuizAnswers: quizAnswerUpdated,
      };

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

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await axios.get("https://opentdb.com/api_category.php");

    res.json(categories.data);
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

export const QuizController = {
  getQuizQuestion,
  getQuizToken,
  getQuizResult,
  getCategories,
};
