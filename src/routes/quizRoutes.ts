import express from 'express';
import * as quizController from '../controllers/QuizController';
import { authMiddleware, adminOnly, studentOnly } from '../middleware/auth';

const router = express.Router();

router.post('/courses/:courseId/quizzes', authMiddleware, adminOnly, quizController.createQuiz);
router.get('/courses/:courseId/quizzes', authMiddleware, quizController.getQuizzesByCourse);
router.get('/:quizId', authMiddleware, quizController.getQuizById);

router.post('/:quizId/submit', authMiddleware, studentOnly, quizController.submitQuiz);
router.get('/my/attempts', authMiddleware, studentOnly, quizController.getMyQuizAttempts);

export default router;
