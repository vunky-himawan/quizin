CREATE TABLE `quiz_answer` (
	`quiz_answer_question_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`quiz_session_id` bigint unsigned NOT NULL,
	`question` text NOT NULL,
	`correct_answer` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_answer_quiz_answer_question_id` PRIMARY KEY(`quiz_answer_question_id`)
) CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`quiz_session_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`total_questions` int NOT NULL,
	`total_correct_answers` int NOT NULL DEFAULT 0,
	`total_incorrect_answers` int NOT NULL DEFAULT 0,
	`total_answered_questions` int NOT NULL DEFAULT 0,
	`score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_sessions_quiz_session_id` PRIMARY KEY(`quiz_session_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quiz_answer` ADD CONSTRAINT `quiz_answer_quiz_session_id_quiz_sessions_quiz_session_id_fk` FOREIGN KEY (`quiz_session_id`) REFERENCES `quiz_sessions`(`quiz_session_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;