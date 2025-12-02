import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import enrollmentService from '../services/EnrollmentService';
import { asyncHandler } from '../utils/asyncHandler';

export const enrollCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const enrollment = await enrollmentService.enrollStudent(req.userId!, req.params.courseId);

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully',
    data: enrollment,
  });
});

export const getMyEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const enrollments = await enrollmentService.getStudentEnrollments(req.userId!);

  res.status(200).json({
    success: true,
    data: enrollments,
  });
});

export const markLessonComplete = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { courseId, lessonId } = req.params;

  const enrollment = await enrollmentService.markLessonComplete(req.userId!, courseId, lessonId);

  res.status(200).json({
    success: true,
    message: 'Lesson marked as complete',
    data: enrollment,
  });
});

export const getCourseEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const enrollments = await enrollmentService.getCourseEnrollments(req.params.courseId);

  res.status(200).json({
    success: true,
    data: enrollments,
  });
});
