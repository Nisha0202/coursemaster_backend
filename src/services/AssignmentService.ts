import { Assignment, AssignmentSubmission, IAssignmentSubmission } from '../models/Assignment';
import { NotFoundError } from '../utils/errors';

export class AssignmentService {
  async createAssignment(courseId: string, assignmentData: any): Promise<any> {
    return Assignment.create({
      ...assignmentData,
      course: courseId,
    });
  }

  async getAssignmentsByCourse(courseId: string): Promise<any[]> {
    return Assignment.find({ course: courseId }).lean();
  }

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    submission: string
  ): Promise<IAssignmentSubmission> {
    return AssignmentSubmission.create({
      assignment: assignmentId,
      student: studentId,
      submission,
    });
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<IAssignmentSubmission[]> {
    return AssignmentSubmission.find({ assignment: assignmentId })
      .populate('student', 'name email')
      .sort('-submittedAt')
      .lean<IAssignmentSubmission[]>();   
  }

  async gradeSubmission(
    submissionId: string,
    score: number,
    feedback: string
  ): Promise<IAssignmentSubmission> {
    const submission = await AssignmentSubmission.findByIdAndUpdate(
      submissionId,
      {
        score,
        feedback,
        graded: true,
      },
      { new: true }
    );

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    return submission;
  }

  async getStudentSubmissions(studentId: string): Promise<IAssignmentSubmission[]> {
    return AssignmentSubmission.find({ student: studentId })
      .populate('assignment', 'title maxScore')
      .sort('-submittedAt')
      .lean<IAssignmentSubmission[]>();   
  }
}

export default new AssignmentService();
