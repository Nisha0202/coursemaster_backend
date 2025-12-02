import Enrollment, { IEnrollment } from '../models/Enrollment';
import Course from '../models/Course';
import { NotFoundError, ConflictError } from '../utils/errors';

export class EnrollmentService {
  async enrollStudent(studentId: string, courseId: string): Promise<IEnrollment> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment) {
      throw new ConflictError('Already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      status: 'active',
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { totalEnrolled: 1 } });

    return enrollment.populate('course', 'title');
  }

  async getStudentEnrollments(studentId: string): Promise<IEnrollment[]> {
    return Enrollment.find({ student: studentId })
      .populate('course', 'title description thumbnail lessons')
      .sort('-enrolledAt')
      .lean<IEnrollment[]>();
  }

  async markLessonComplete(studentId: string, courseId: string, lessonId: string): Promise<IEnrollment> {
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (!enrollment.completedLessons.includes(lessonId as any)) {
      enrollment.completedLessons.push(lessonId as any);
    }

    const course = await Course.findById(courseId);
    const totalLessons = course?.lessons.length || 1;
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    return enrollment;
  }

  async getCourseEnrollments(courseId: string): Promise<IEnrollment[]> {
    return Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .sort('-enrolledAt')
      .lean<IEnrollment[]>();
  }
}

export default new EnrollmentService();
