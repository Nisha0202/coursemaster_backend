import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import authService from '../services/AuthService';
import { registerSchema, loginSchema } from '../utils/validators';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const { user, token } = await authService.register(name, email, password);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const adminLogin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, adminSecretKey } = req.body;

  const { user, token } = await authService.adminLogin(email, password, adminSecretKey);

  res.status(200).json({
    success: true,
    message: 'Admin login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getUserById(req.userId!);

  res.status(200).json({
    success: true,
    data: user,
  });
});
