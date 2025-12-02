import express from 'express';
import * as courseController from '../controllers/CourseController';
import { authMiddleware, adminOnly } from '../middleware/auth';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

router.get('/', cacheMiddleware('courses'), courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/category/:category', courseController.getCoursesByCategory);

router.post('/', authMiddleware, adminOnly, courseController.createCourse);
router.patch('/:id', authMiddleware, adminOnly, courseController.updateCourse);
router.delete('/:id', authMiddleware, adminOnly, courseController.deleteCourse);

export default router;
