import Course from '../models/Course.js';
import SubCourse from '../models/SubCourse.js';

// Get all public courses
export const getPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isDeleted: false, active: true }).lean();
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific public course by ID
export const getPublicSpecificCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isDeleted: false,
      active: true,
    }).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all public subcourses for a specific course
export const getPublicSubcourses = async (req, res) => {
  try {
    const subcourses = await SubCourse.find({
      courseId: req.params.courseId,
      isDeleted: false,
      active: true,
    }).lean();
    res.status(200).json({ success: true, data: subcourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific public subcourse by ID
export const getPublicSpecificSubcourse = async (req, res) => {
  try {
    const subcourse = await SubCourse.findOne({
      _id: req.params.subCourseId,
      courseId: req.params.courseId,
      isDeleted: false,
      active: true,
    }).lean();
    if (!subcourse) {
      return res.status(404).json({ success: false, message: 'Subcourse not found' });
    }
    res.status(200).json({ success: true, data: subcourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};