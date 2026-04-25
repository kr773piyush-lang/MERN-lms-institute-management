import { v4 as uuidv4 } from 'uuid';
import UserSelectedCourse from '../models/UserSelectedCourse.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

class UserSelectedCourseService {
  /**
   * Add course to student's selection
   */
  static async selectCourse(courseData, instituteId, userId) {
    try {
      const { courseId, subCourseId, batchId, selectionType = 'SELF_SELECTED', notes } = courseData;

      // Validate course exists
      const course = await Course.findById(courseId);
      if (!course) {
        throw new NotFoundError('Course not found');
      }

      // Check if already selected
      const existingSelection = await UserSelectedCourse.findOne({
        userId,
        courseId,
      });

      if (existingSelection) {
        throw new ConflictError('Course already selected by user');
      }

      const selectionId = uuidv4();

      const selection = new UserSelectedCourse({
        _id: selectionId,
        instituteId,
        userId,
        courseId,
        subCourseId: subCourseId || null,
        batchId: batchId || null,
        selectionType,
        notes,
        status: 'PENDING',
        startedAt: null,
      });

      await selection.save();
      return selection;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student's selected courses
   */
  static async getStudentSelectedCourses(userId, instituteId, filterByStatus = null) {
    try {
      let query = {
        userId,
        instituteId,
      };

      if (filterByStatus) {
        query.status = filterByStatus;
      }

      const selections = await UserSelectedCourse.find(query)
        .populate('courseId', 'courseName description level')
        .populate('subCourseId', 'subCourseName')
        .populate('batchId', 'batchName')
        .sort({ priority: -1, createdAt: -1 })
        .lean();

      return selections;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get favorite courses for student
   */
  static async getFavoriteCourses(userId, instituteId) {
    try {
      const favorites = await UserSelectedCourse.find({
        userId,
        instituteId,
        isFavorite: true,
      })
        .populate('courseId', 'courseName description')
        .sort({ priority: -1 })
        .lean();

      return favorites;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle favorite course
   */
  static async toggleFavorite(selectionId, isFavorite) {
    try {
      const selection = await UserSelectedCourse.findByIdAndUpdate(
        selectionId,
        { isFavorite },
        { new: true }
      );

      if (!selection) {
        throw new NotFoundError('Course selection not found');
      }

      return selection;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update course selection status
   */
  static async updateSelectionStatus(selectionId, status) {
    try {
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'];

      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      const updateData = { status };

      // Set timestamps based on status
      if (status === 'IN_PROGRESS') {
        updateData.startedAt = new Date();
      } else if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }

      const selection = await UserSelectedCourse.findByIdAndUpdate(
        selectionId,
        updateData,
        { new: true }
      );

      if (!selection) {
        throw new NotFoundError('Course selection not found');
      }

      return selection;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove course from selection
   */
  static async removeSelection(selectionId) {
    try {
      const selection = await UserSelectedCourse.findByIdAndDelete(selectionId);

      if (!selection) {
        throw new NotFoundError('Course selection not found');
      }

      return selection;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reorder selected courses by priority
   */
  static async updatePriority(selectionId, priority) {
    try {
      const selection = await UserSelectedCourse.findByIdAndUpdate(
        selectionId,
        { priority },
        { new: true }
      );

      if (!selection) {
        throw new NotFoundError('Course selection not found');
      }

      return selection;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get course statistics for admin
   */
  static async getCourseSelectionStats(courseId, instituteId) {
    try {
      const totalSelections = await UserSelectedCourse.countDocuments({
        courseId,
        instituteId,
      });

      const statusBreakdown = await UserSelectedCourse.aggregate([
        {
          $match: {
            courseId,
            instituteId,
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const favoriteCount = await UserSelectedCourse.countDocuments({
        courseId,
        instituteId,
        isFavorite: true,
      });

      return {
        totalSelections,
        statusBreakdown: Object.fromEntries(
          statusBreakdown.map((sb) => [sb._id, sb.count])
        ),
        favoriteCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default UserSelectedCourseService;
