import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const quizSessions = mysqlTable("quiz_sessions", {
  id: bigint("quiz_session_id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  totalQuestions: bigint("total_questions", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  totalCorrectAnswers: bigint("total_correct_answers", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .default(0),
  totalIncorrectAnswers: bigint("total_incorrect_answers", {
    mode: "number",
    unsigned: true,
  }),
  totalAnsweredQuestions: bigint("total_answered_questions", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .default(0),
  score: bigint("score", { mode: "number", unsigned: true })
    .notNull()
    .default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

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
  question: varchar("question", { length: 255 }).notNull(),
  correctAnswer: varchar("correct_answer", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
