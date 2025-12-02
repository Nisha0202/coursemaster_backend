import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import courseService from '../services/CourseService';
import { courseSchema } from '../utils/validators';
import { asyncHandler } from '../utils/asyncHandler';
import { invalidateCache } from '../middleware/cache';

export const getAllCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const category = req.query.category as string;
  const level = req.query.level as string;
  const sort = (req.query.sort as string) || '-createdAt';

  const { courses, total, pages } = await courseService.getAllCourses(
    page,
    limit,
    search,
    category,
    level,
    sort
  );

  res.status(200).json({
    success: true,
    data: {
      courses,
      pagination: { page, limit, total, pages },
    },
  });
});

export const getCourseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const course = await courseService.getCourseById(req.params.id);

  res.status(200).json({
    success: true,
    data: course,
  });
});

export const createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const courseData = courseSchema.parse(req.body);


  const course = await courseService.createCourse(courseData, req.userId!);

  await invalidateCache('courses');

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course,
  });
});

export const updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const course = await courseService.updateCourse(req.params.id, req.body);

  await invalidateCache('courses');

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course,
  });
});

export const deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  await courseService.deleteCourse(req.params.id);

  await invalidateCache('courses');

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

export const getCoursesByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = req.params.category;
  const courses = await courseService.getCoursesByCategory(category);

  res.status(200).json({
    success: true,
    data: courses,
  });
});
