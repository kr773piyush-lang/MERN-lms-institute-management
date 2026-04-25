import Course from '../models/Course.js';
import SubCourse from '../models/SubCourse.js';
import Module from '../models/Module.js';
import Content from '../models/Content.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { generateId, paginationHelper, buildPaginatedResponse } from '../utils/helpers.js';

export class CourseService {
  // ========== COURSE ==========

  async createCourse(courseData, instituteId, createdBy) {
    try {
      const course = new Course({
        _id: generateId(),
        instituteId,
        courseName: courseData.courseName,
        description: courseData.description,
        duration: courseData.duration,
        level: courseData.level || 'BEGINNER',
        createdBy,
      });

      await course.save();
      return course.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getCourses(instituteId, page, limit) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const courses = await Course.find({
        instituteId,
        isDeleted: false,
      })
        .skip(skip)
        .limit(pageLimit)
        .lean();

      const total = await Course.countDocuments({
        instituteId,
        isDeleted: false,
      });

      return buildPaginatedResponse(courses, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getCourseById(courseId) {
    try {
      const course = await Course.findById(courseId).lean();

      if (!course || course.isDeleted) {
        throw new NotFoundError('Course not found');
      }

      return course;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(courseId, updateData) {
    try {
      const course = await Course.findByIdAndUpdate(
        courseId,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!course) {
        throw new NotFoundError('Course not found');
      }

      return course;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      const course = await Course.findByIdAndUpdate(
        courseId,
        { isDeleted: true },
        { new: true }
      ).lean();

      if (!course) {
        throw new NotFoundError('Course not found');
      }

      return { message: 'Course deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // ========== SUBCOURSE ==========

  async createSubCourse(subCourseData, instituteId, createdBy) {
    try {
      const subcourse = new SubCourse({
        _id: generateId(),
        courseId: subCourseData.courseId,
        instituteId,
        subCourseName: subCourseData.subCourseName,
        description: subCourseData.description,
        sequenceNo: subCourseData.sequenceNo,
        createdBy,
      });

      await subcourse.save();
      return subcourse.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getSubCourses(courseId) {
    try {
      const subcourses = await SubCourse.find({
        courseId,
        isDeleted: false,
      }).lean();

      return subcourses;
    } catch (error) {
      throw error;
    }
  }

  async updateSubCourse(subCourseId, updateData) {
    try {
      const subcourse = await SubCourse.findByIdAndUpdate(
        subCourseId,
        updateData,
        { new: true }
      ).lean();

      if (!subcourse) {
        throw new NotFoundError('SubCourse not found');
      }

      return subcourse;
    } catch (error) {
      throw error;
    }
  }

  // ========== MODULE ==========

  async createModule(moduleData, instituteId, createdBy) {
    try {
      const module = new Module({
        _id: generateId(),
        courseId: moduleData.courseId,
        subCourseId: moduleData.subCourseId,
        instituteId,
        moduleName: moduleData.moduleName,
        description: moduleData.description,
        sequenceNo: moduleData.sequenceNo,
        duration: moduleData.duration,
        createdBy,
      });

      await module.save();
      return module.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getModules(subCourseId) {
    try {
      const modules = await Module.find({
        subCourseId,
        isDeleted: false,
      }).lean();

      return modules;
    } catch (error) {
      throw error;
    }
  }

  async getModuleById(moduleId) {
    try {
      const module = await Module.findById(moduleId).lean();

      if (!module || module.isDeleted) {
        throw new NotFoundError('Module not found');
      }

      return module;
    } catch (error) {
      throw error;
    }
  }

  async updateModule(moduleId, updateData) {
    try {
      const module = await Module.findByIdAndUpdate(
        moduleId,
        updateData,
        { new: true }
      ).lean();

      if (!module) {
        throw new NotFoundError('Module not found');
      }

      return module;
    } catch (error) {
      throw error;
    }
  }

  // ========== CONTENT ==========

  async createContent(contentData, instituteId, createdBy) {
    try {
      const content = new Content({
        _id: generateId(),
        moduleId: contentData.moduleId,
        instituteId,
        title: contentData.title,
        description: contentData.description,
        contentType: contentData.contentType,
        url: contentData.url,
        fileSize: contentData.fileSize,
        duration: contentData.duration,
        orderIndex: contentData.orderIndex,
        isPreview: contentData.isPreview || false,
        createdBy,
      });

      await content.save();
      return content.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getContentByModule(moduleId) {
    try {
      const content = await Content.find({
        moduleId,
        isDeleted: false,
      })
        .sort({ orderIndex: 1 })
        .lean();

      return content;
    } catch (error) {
      throw error;
    }
  }

  async updateContent(contentId, updateData) {
    try {
      const content = await Content.findByIdAndUpdate(
        contentId,
        updateData,
        { new: true }
      ).lean();

      if (!content) {
        throw new NotFoundError('Content not found');
      }

      return content;
    } catch (error) {
      throw error;
    }
  }

  async deleteContent(contentId) {
    try {
      const content = await Content.findByIdAndUpdate(
        contentId,
        { isDeleted: true },
        { new: true }
      ).lean();

      if (!content) {
        throw new NotFoundError('Content not found');
      }

      return { message: 'Content deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
