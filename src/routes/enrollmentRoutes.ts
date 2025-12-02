import express from 'express';
import * as enrollmentController from '../controllers/EnrollmentController';
import { authMiddleware, studentOnly, adminOnly } from '../middleware/auth';

const router = express.Router();

router.post('/:courseId', authMiddleware, studentOnly, enrollmentController.enrollCourse);
router.get('/my/enrollments', authMiddleware, studentOnly, enrollmentController.getMyEnrollments);
router.patch(
  '/:courseId/lessons/:lessonId/complete',
  authMiddleware,
  studentOnly,
  enrollmentController.markLessonComplete
);
router.get('/:courseId/students', authMiddleware, adminOnly, enrollmentController.getCourseEnrollments);

export default router;
