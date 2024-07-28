import { db } from "..";
import { quizAnswer, quizSessions } from "../schema";

export const seedQuestions = async () => {
  // Delete all data question
  await db.transaction(async (tx) => {
    await tx.delete(quizAnswer);
    await tx.delete(quizSessions);
  });
};
