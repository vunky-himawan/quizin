import { relations } from "drizzle-orm";
import {
  bigint,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  quizSessions: many(quizSessions),
}));

export const quizSessions = mysqlTable("quiz_sessions", {
  id: bigint("quiz_session_id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  totalQuestions: int("total_questions").notNull(),
  totalCorrectAnswers: int("total_correct_answers").notNull().default(0),
  totalIncorrectAnswers: int("total_incorrect_answers").notNull().default(0),
  totalAnsweredQuestions: int("total_answered_questions").notNull().default(0),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const quizSessionsRelations = relations(
  quizSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [quizSessions.userId],
      references: [users.id],
    }),
    quizAnswers: many(quizAnswer),
  })
);

export const quizAnswer = mysqlTable("quiz_answer", {
  id: bigint("quiz_answer_question_id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  quizSessionId: bigint("quiz_session_id", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => quizSessions.id),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const quisAnswerRelations = relations(quizAnswer, ({ one }) => ({
  quizSession: one(quizSessions, {
    fields: [quizAnswer.quizSessionId],
    references: [quizSessions.id],
  }),
}));
