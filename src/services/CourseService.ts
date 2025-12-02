import Course, { ICourse } from '../models/Course';
import { NotFoundError } from '../utils/errors';
import { ICourseInput } from '../utils/validators';
export class CourseService {
  async getAllCourses(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    level?: string,
    sort: string = '-createdAt'
  ): Promise<{ courses: ICourse[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean<ICourse[]>();

    return {
      courses,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getCourseById(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId).populate('instructor', 'name email');
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  async createCourse(courseData:ICourseInput, instructorId: string): Promise<ICourse> {
    const course = await Course.create({
      ...courseData,
      instructor: instructorId,
    });
    return course.populate('instructor', 'name email');
  }

  async updateCourse(courseId: string, updateData: Partial<ICourse>): Promise<ICourse> {
    const course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    }).populate('instructor', 'name email');

    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  async deleteCourse(courseId: string): Promise<void> {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
  }

  async getCoursesByCategory(category: string, limit: number = 5): Promise<ICourse[]> {
    return Course.find({ category })
      .populate('instructor', 'name email')
      .limit(limit)
      .lean<ICourse[]>();
  }
}

export default new CourseService();
