import { CourseService } from '../services/CourseService.js';
import { catchAsync } from '../utils/errors.js';
import {
  createCourseValidation,
  createSubCourseValidation,
  createModuleValidation,
  createContentValidation,
  updateCourseValidation,
} from '../validations/courseValidation.js';

const courseService = new CourseService();

// ===== COURSE =====

export const createCourse = catchAsync(async (req, res) => {
  const { error, value } = createCourseValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const course = await courseService.createCourse(
    value,
    req.user.instituteId,
    req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course,
  });
});

export const getCourses = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await courseService.getCourses(
    req.user.instituteId,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);

  res.status(200).json({
    success: true,
    data: course,
  });
});

export const updateCourse = catchAsync(async (req, res) => {
  const { error, value } = updateCourseValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const course = await courseService.updateCourse(req.params.courseId, value);

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course,
  });
});

export const deleteCourse = catchAsync(async (req, res) => {
  const result = await courseService.deleteCourse(req.params.courseId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// ===== SUBCOURSE =====

export const createSubCourse = catchAsync(async (req, res) => {
  const { error, value } = createSubCourseValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const subcourse = await courseService.createSubCourse(
    value,
    req.user.instituteId,
    req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'SubCourse created successfully',
    data: subcourse,
  });
});

export const getSubCourses = catchAsync(async (req, res) => {
  const subcourses = await courseService.getSubCourses(req.params.courseId);

  res.status(200).json({
    success: true,
    data: subcourses,
  });
});

export const updateSubCourse = catchAsync(async (req, res) => {
  const subcourse = await courseService.updateSubCourse(
    req.params.subCourseId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'SubCourse updated successfully',
    data: subcourse,
  });
});

// ===== MODULE =====

export const createModule = catchAsync(async (req, res) => {
  const { error, value } = createModuleValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const module = await courseService.createModule(
    value,
    req.user.instituteId,
    req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'Module created successfully',
    data: module,
  });
});

export const getModules = catchAsync(async (req, res) => {
  const modules = await courseService.getModules(req.params.subCourseId);

  res.status(200).json({
    success: true,
    data: modules,
  });
});

export const getModuleById = catchAsync(async (req, res) => {
  const module = await courseService.getModuleById(req.params.moduleId);

  res.status(200).json({
    success: true,
    data: module,
  });
});

export const updateModule = catchAsync(async (req, res) => {
  const module = await courseService.updateModule(
    req.params.moduleId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Module updated successfully',
    data: module,
  });
});

// ===== CONTENT =====

export const createContent = catchAsync(async (req, res) => {
  const { error, value } = createContentValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const content = await courseService.createContent(
    value,
    req.user.instituteId,
    req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'Content created successfully',
    data: content,
  });
});

export const getContentByModule = catchAsync(async (req, res) => {
  const content = await courseService.getContentByModule(req.params.moduleId);

  res.status(200).json({
    success: true,
    data: content,
  });
});

export const updateContent = catchAsync(async (req, res) => {
  const content = await courseService.updateContent(
    req.params.contentId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Content updated successfully',
    data: content,
  });
});

export const deleteContent = catchAsync(async (req, res) => {
  const result = await courseService.deleteContent(req.params.contentId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
