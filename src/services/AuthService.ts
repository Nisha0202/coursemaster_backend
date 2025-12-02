import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../utils/errors';

export class AuthService {
  async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
    });

    const token = generateToken(user._id.toString(), 'student');
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user._id.toString(), user.role);
    return { user, token };
  }

  async adminLogin(email: string, password: string, adminSecretKey: string): Promise<{ user: IUser; token: string }> {
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new UnauthorizedError('Invalid admin secret key');
    }

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      throw new UnauthorizedError('Admin not found');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user._id.toString(), 'admin');
    return { user, token };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }
}

export default new AuthService();
