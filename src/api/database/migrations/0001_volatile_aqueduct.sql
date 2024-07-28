CREATE TABLE `quiz_answer` (
	`quiz_answer_question_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`quiz_session_id` bigint unsigned NOT NULL,
	`question` varchar(255) NOT NULL,
	`correct_answer` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_answer_quiz_answer_question_id` PRIMARY KEY(`quiz_answer_question_id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`quiz_session_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`total_questions` bigint unsigned NOT NULL,
	`total_correct_answers` bigint unsigned NOT NULL,
	`total_incorrect_answers` bigint unsigned NOT NULL,
	`score` bigint unsigned NOT NULL,
	`end_session` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_sessions_quiz_session_id` PRIMARY KEY(`quiz_session_id`)
);
--> statement-breakpoint
ALTER TABLE `quiz_answer` ADD CONSTRAINT `quiz_answer_quiz_session_id_quiz_sessions_quiz_session_id_fk` FOREIGN KEY (`quiz_session_id`) REFERENCES `quiz_sessions`(`quiz_session_id`) ON DELETE no action ON UPDATE no action;