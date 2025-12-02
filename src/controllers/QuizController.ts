import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import quizService from '../services/QuizService';
import { quizSchema } from '../utils/validators';
import { asyncHandler } from '../utils/asyncHandler';

export const createQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = quizSchema.parse(req.body);

  const quiz = await quizService.createQuiz(req.params.courseId, data);

  res.status(201).json({
    success: true,
    message: 'Quiz created',
    data: quiz,
  });
});

export const getQuizzesByCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const quizzes = await quizService.getQuizzesByCourse(req.params.courseId);

  res.status(200).json({
    success: true,
    data: quizzes,
  });
});

export const getQuizById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const quiz = await quizService.getQuizById(req.params.quizId);

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

export const submitQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { answers } = req.body;

  const attempt = await quizService.submitQuiz(req.params.quizId, req.userId!, answers);

  res.status(201).json({
    success: true,
    message: 'Quiz submitted',
    data: {
      score: attempt.score,
      passed: attempt.passed,
    },
  });
});

export const getMyQuizAttempts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const quizId = req.query.quizId as string | undefined;
  const attempts = await quizService.getStudentQuizAttempts(req.userId!, quizId);

  res.status(200).json({
    success: true,
    data: attempts,
  });
});
