import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price cannot be negative'),
  lessons: z.array(
    z.object({
      title: z.string(),
      videoUrl: z.string().url('Invalid video URL'),
      duration: z.number(),
      order: z.number(),
      description: z.string().optional(),
    })
  ),
});


export type ICourseInput = z.infer<typeof courseSchema>;


export const quizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  totalPoints: z.number().min(1),
  passingScore: z.number().min(0).max(100),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).min(2, 'At least 2 options required'),
      correctAnswer: z.number(),
      points: z.number().default(1),
    })
  ),
});

export const assignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  dueDate: z.string().datetime(),
  maxScore: z.number().default(100),
});
