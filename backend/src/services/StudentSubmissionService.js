import { v4 as uuidv4 } from 'uuid';
import StudentSubmission from '../models/StudentSubmission.js';
import Content from '../models/Content.js';
import User from '../models/User.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors.js';

class StudentSubmissionService {
  /**
   * Create or update student submission
   */
  static async submitAssignment(submissionData, instituteId) {
    try {
      const { contentId, userId, responseType, responseText, responseUrl } = submissionData;

      // Validate content exists
      const content = await Content.findById(contentId);
      if (!content) {
        throw new NotFoundError('Content not found');
      }

      // Validate user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if already submitted and submission is graded
      const existingSubmission = await StudentSubmission.findOne({
        contentId,
        userId,
      });

      if (existingSubmission && existingSubmission.status === 'GRADED') {
        throw new ConflictError('Cannot resubmit graded assignment');
      }

      const submissionId = uuidv4();

      const submissionPayload = {
        _id: submissionId,
        instituteId,
        contentId,
        userId,
        responseType,
        responseText: responseType === 'TEXT' ? responseText : null,
        responseUrl: responseType === 'URL' ? responseUrl : null,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      };

      let submission;
      if (existingSubmission) {
        submission = await StudentSubmission.findByIdAndUpdate(
          existingSubmission._id,
          submissionPayload,
          { new: true }
        );
      } else {
        submission = new StudentSubmission(submissionPayload);
        await submission.save();
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student submissions for content
   */
  static async getSubmissionsByContent(contentId, instituteId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const submissions = await StudentSubmission.find({
        contentId,
        instituteId,
      })
        .populate('userId', 'firstName lastName email')
        .populate('gradedBy', 'firstName lastName')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await StudentSubmission.countDocuments({
        contentId,
        instituteId,
      });

      return {
        submissions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student's submissions for a course
   */
  static async getStudentSubmissions(userId, instituteId, courseId = null) {
    try {
      let query = {
        userId,
        instituteId,
      };

      if (courseId) {
        // Get all content from this course
        const modules = await Module.find({ courseId });
        const moduleIds = modules.map((m) => m._id);
        const contents = await Content.find({ moduleId: { $in: moduleIds } });
        const contentIds = contents.map((c) => c._id);
        query.contentId = { $in: contentIds };
      }

      const submissions = await StudentSubmission.find(query)
        .populate('contentId', 'title type')
        .sort({ submittedAt: -1 })
        .lean();

      return submissions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Grade assignment
   */
  static async gradeSubmission(submissionId, gradeData, gradedBy) {
    try {
      const { score, feedback, status } = gradeData;

      const submission = await StudentSubmission.findByIdAndUpdate(
        submissionId,
        {
          score,
          feedback,
          status: status || 'GRADED',
          gradedBy,
          gradedAt: new Date(),
        },
        { new: true }
      );

      if (!submission) {
        throw new NotFoundError('Submission not found');
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get submission by ID
   */
  static async getSubmissionById(submissionId) {
    try {
      const submission = await StudentSubmission.findById(submissionId)
        .populate('userId', 'firstName lastName email')
        .populate('contentId', 'title type duration')
        .populate('gradedBy', 'firstName lastName')
        .lean();

      if (!submission) {
        throw new NotFoundError('Submission not found');
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete submission
   */
  static async deleteSubmission(submissionId) {
    try {
      const submission = await StudentSubmission.findByIdAndDelete(submissionId);

      if (!submission) {
        throw new NotFoundError('Submission not found');
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pending grading submissions
   */
  static async getPendingGradingSubmissions(instituteId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const submissions = await StudentSubmission.find({
        instituteId,
        status: 'SUBMITTED',
      })
        .populate('userId', 'firstName lastName email')
        .populate('contentId', 'title type')
        .sort({ submittedAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await StudentSubmission.countDocuments({
        instituteId,
        status: 'SUBMITTED',
      });

      return {
        submissions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default StudentSubmissionService;
