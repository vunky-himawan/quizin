import express from "express";
import { UserController } from "../controller/UserController";
import { AuthController } from "../controller/AuthController";
import { verifyToken } from "../middleware/verifyToken";
import { QuizController } from "../controller/QuizController";

const router = express.Router();

router.get("/users", verifyToken, UserController.getAllUsers);

/* Auth Routes */
router.post("/auth/register", AuthController.Register);
router.post("/auth/login", AuthController.Login);
router.get("/auth/refresh", AuthController.RefreshToken);
router.delete("/auth/logout", AuthController.Logout);

/* User Questions Routes */
router.get("/quiz/token", verifyToken, QuizController.getQuizToken);
router.post("/quiz/questions", verifyToken, QuizController.getQuizQuestion);
router.post("/quiz/answer", verifyToken, QuizController.getQuizResult);
router.get("/quiz/categories", verifyToken, QuizController.getCategories);

export default router;
