import express from 'express';
import * as authController from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
