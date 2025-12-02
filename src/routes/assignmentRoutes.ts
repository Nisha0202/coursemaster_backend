import express from 'express';
import * as assignmentController from '../controllers/AssignmentController';
import { authMiddleware, adminOnly, studentOnly } from '../middleware/auth';

const router = express.Router();

router.post('/courses/:courseId/assignments', authMiddleware, adminOnly, assignmentController.createAssignment);
router.get('/courses/:courseId/assignments', authMiddleware, assignmentController.getAssignmentsByCourse);

router.post('/:assignmentId/submit', authMiddleware, studentOnly, assignmentController.submitAssignment);
router.get('/my/submissions', authMiddleware, studentOnly, assignmentController.getMySubmissions);

router.get('/:assignmentId/submissions', authMiddleware, adminOnly, assignmentController.getSubmissionsByAssignment);
router.patch('/:submissionId/grade', authMiddleware, adminOnly, assignmentController.gradeSubmission);

export default router;
