import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Progress from '../models/Progress.js';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors.js';
import { generateId, paginationHelper, buildPaginatedResponse } from '../utils/helpers.js';

export class EnrollmentService {
  async enrollStudent(enrollmentData, instituteId) {
    try {
      const user = await User.findById(enrollmentData.userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const course = await Course.findById(enrollmentData.courseId);
      if (!course) {
        throw new NotFoundError('Course not found');
      }

      // Check if already enrolled
      const existing = await Enrollment.findOne({
        userId: enrollmentData.userId,
        courseId: enrollmentData.courseId,
      });

      if (existing) {
        throw new ConflictError('Student already enrolled in this course');
      }

      const enrollment = new Enrollment({
        _id: generateId(),
        instituteId,
        userId: enrollmentData.userId,
        courseId: enrollmentData.courseId,
        subCourseId: enrollmentData.subCourseId,
        batchId: enrollmentData.batchId,
        enrollmentStatus: 'ENROLLED',
      });

      await enrollment.save();

      // Send notification
      await Notification.create({
        _id: generateId(),
        userId: enrollmentData.userId,
        instituteId,
        title: 'Enrollment Confirmed',
        message: `You have been enrolled in: ${course.courseName}`,
        type: 'SUCCESS',
        relatedEntityType: 'Course',
        relatedEntityId: enrollmentData.courseId,
      });

      return enrollment.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getEnrollments(instituteId, page, limit, filters = {}) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const query = { instituteId, ...filters };
      const enrollments = await Enrollment.find(query)
        .skip(skip)
        .limit(pageLimit)
        .populate('userId', 'firstName lastName email')
        .populate('courseId', 'courseName')
        .lean();

      const total = await Enrollment.countDocuments(query);

      return buildPaginatedResponse(enrollments, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getStudentEnrollments(userId) {
    try {
      const enrollments = await Enrollment.find({ userId })
        .populate('courseId', 'courseName')
        .populate('subCourseId', 'subCourseName')
        .lean();

      return enrollments;
    } catch (error) {
      throw error;
    }
  }

  async updateEnrollmentStatus(enrollmentId, status) {
    try {
      const enrollment = await Enrollment.findByIdAndUpdate(
        enrollmentId,
        {
          enrollmentStatus: status,
          completedAt: status === 'COMPLETED' ? new Date() : null,
        },
        { new: true }
      ).lean();

      if (!enrollment) {
        throw new NotFoundError('Enrollment not found');
      }

      return enrollment;
    } catch (error) {
      throw error;
    }
  }

  async getEnrollmentStats(instituteId) {
    try {
      const totalEnrollments = await Enrollment.countDocuments({ instituteId });
      const activeEnrollments = await Enrollment.countDocuments({
        instituteId,
        enrollmentStatus: 'ENROLLED',
      });
      const completedEnrollments = await Enrollment.countDocuments({
        instituteId,
        enrollmentStatus: 'COMPLETED',
      });

      return {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
      };
    } catch (error) {
      throw error;
    }
  }

  async issueCertificate(enrollmentId, certificateUrl) {
    try {
      const enrollment = await Enrollment.findByIdAndUpdate(
        enrollmentId,
        {
          certificateIssued: true,
          certificateUrl,
        },
        { new: true }
      ).lean();

      if (!enrollment) {
        throw new NotFoundError('Enrollment not found');
      }

      return enrollment;
    } catch (error) {
      throw error;
    }
  }
}
