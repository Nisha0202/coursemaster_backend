import { Quiz, QuizAttempt, IQuizAttempt } from '../models/Quiz';
import { NotFoundError } from '../utils/errors';

export class QuizService {
  async createQuiz(courseId: string, quizData: any): Promise<any> {
    return Quiz.create({
      ...quizData,
      course: courseId,
    });
  }

  async getQuizzesByCourse(courseId: string): Promise<any[]> {
    return Quiz.find({ course: courseId }).select('-questions.correctAnswer').lean();
  }

  async getQuizById(quizId: string, includeAnswers: boolean = false): Promise<any> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (!includeAnswers) {
      quiz.questions = quiz.questions.map((q) => ({
        ...q.toObject(),
        correctAnswer: undefined,
      }));
    }

    return quiz;
  }

  async submitQuiz(quizId: string, studentId: string, answers: number[]): Promise<IQuizAttempt> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    let score = 0;
    answers.forEach((answer, index) => {
      if (quiz.questions[index] && quiz.questions[index].correctAnswer === answer) {
        score += quiz.questions[index].points;
      }
    });

    const passed = score >= quiz.passingScore;

    return QuizAttempt.create({
      quiz: quizId,
      student: studentId,
      answers,
      score,
      passed,
    });
  }

  async getStudentQuizAttempts(studentId: string, quizId?: string): Promise<IQuizAttempt[]> {
    const query: any = { student: studentId };
    if (quizId) query.quiz = quizId;

    return QuizAttempt.find(query)
      .populate('quiz', 'title totalPoints')
      .sort('-attemptedAt')
      .lean<IQuizAttempt[]>();
  }
}

export default new QuizService();
