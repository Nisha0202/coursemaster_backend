import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import assignmentService from '../services/AssignmentService';
import { assignmentSchema } from '../utils/validators';
import { asyncHandler } from '../utils/asyncHandler';

export const createAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = assignmentSchema.parse(req.body);

  const assignment = await assignmentService.createAssignment(req.params.courseId, data);

  res.status(201).json({
    success: true,
    message: 'Assignment created',
    data: assignment,
  });
});

export const getAssignmentsByCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const assignments = await assignmentService.getAssignmentsByCourse(req.params.courseId);

  res.status(200).json({
    success: true,
    data: assignments,
  });
});

export const submitAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { submission } = req.body;

  const submission_data = await assignmentService.submitAssignment(
    req.params.assignmentId,
    req.userId!,
    submission
  );

  res.status(201).json({
    success: true,
    message: 'Assignment submitted',
    data: submission_data,
  });
});

export const getSubmissionsByAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const submissions = await assignmentService.getSubmissionsByAssignment(req.params.assignmentId);

  res.status(200).json({
    success: true,
    data: submissions,
  });
});

export const gradeSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { score, feedback } = req.body;

  const submission = await assignmentService.gradeSubmission(req.params.submissionId, score, feedback);

  res.status(200).json({
    success: true,
    message: 'Assignment graded',
    data: submission,
  });
});

export const getMySubmissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const submissions = await assignmentService.getStudentSubmissions(req.userId!);

  res.status(200).json({
    success: true,
    data: submissions,
  });
});
