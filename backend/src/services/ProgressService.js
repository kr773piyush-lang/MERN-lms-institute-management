import Progress from '../models/Progress.js';
import Module from '../models/Module.js';
import Content from '../models/Content.js';
import Enrollment from '../models/Enrollment.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { generateId } from '../utils/helpers.js';

export class ProgressService {
  async updateProgress(progressData, instituteId) {
    try {
      const module = await Module.findById(progressData.moduleId);
      if (!module) {
        throw new NotFoundError('Module not found');
      }

      let progress = await Progress.findOne({
        userId: progressData.userId,
        moduleId: progressData.moduleId,
      });

      if (!progress) {
        progress = new Progress({
          _id: generateId(),
          instituteId,
          userId: progressData.userId,
          moduleId: progressData.moduleId,
          contentId: progressData.contentId,
        });
      }

      if (progressData.isCompleted !== undefined) {
        progress.isCompleted = progressData.isCompleted;
        if (progressData.isCompleted) {
          progress.completedAt = new Date();
          progress.progressPercentage = 100;
        }
      }

      if (progressData.progressPercentage !== undefined) {
        progress.progressPercentage = Math.min(
          100,
          progressData.progressPercentage
        );
      }

      if (progressData.watchedDuration !== undefined) {
        progress.watchedDuration = progressData.watchedDuration;
      }

      progress.lastAccessedAt = new Date();

      await progress.save();

      // Update enrollment completion percentage
      const moduleProgressList = await Progress.find({
        userId: progressData.userId,
      });

      const avgProgress =
        moduleProgressList.reduce((sum, p) => sum + p.progressPercentage, 0) /
        (moduleProgressList.length || 1);

      await Enrollment.updateMany(
        { userId: progressData.userId },
        { completionPercentage: Math.round(avgProgress) }
      );

      return progress.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getModuleProgress(userId, moduleId) {
    try {
      let progress = await Progress.findOne({
        userId,
        moduleId,
      }).lean();

      if (!progress) {
        progress = {
          userId,
          moduleId,
          isCompleted: false,
          progressPercentage: 0,
        };
      }

      return progress;
    } catch (error) {
      throw error;
    }
  }

  async getStudentProgress(userId) {
    try {
      const progress = await Progress.find({ userId }).lean();

      const totalModules = progress.length;
      const completedModules = progress.filter((p) => p.isCompleted).length;
      const avgProgress =
        progress.reduce((sum, p) => sum + p.progressPercentage, 0) /
        (totalModules || 1);

      return {
        totalModules,
        completedModules,
        averageProgress: Math.round(avgProgress),
        modules: progress,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCourseProgress(userId, courseId) {
    try {
      const modules = await Module.find({ courseId }).lean();
      const moduleIds = modules.map((m) => m._id);

      const progress = await Progress.find({
        userId,
        moduleId: { $in: moduleIds },
      }).lean();

      const totalModules = moduleIds.length;
      const completedModules = progress.filter((p) => p.isCompleted).length;
      const avgProgress =
        progress.reduce((sum, p) => sum + p.progressPercentage, 0) /
        (totalModules || 1);

      return {
        courseId,
        totalModules,
        completedModules,
        averageProgress: Math.round(avgProgress),
      };
    } catch (error) {
      throw error;
    }
  }

  async getBatchProgress(batchId) {
    try {
      const enrollments = await Enrollment.find({
        batchId,
        enrollmentStatus: 'ENROLLED',
      }).lean();

      const progressData = await Promise.all(
        enrollments.map(async (enrollment) => {
          const studentProgress = await this.getStudentProgress(
            enrollment.userId
          );
          return {
            userId: enrollment.userId,
            ...studentProgress,
          };
        })
      );

      return progressData;
    } catch (error) {
      throw error;
    }
  }
}
