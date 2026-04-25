import express from 'express';
import {
  getPublicCourses,
  getPublicSpecificCourse,
  getPublicSubcourses,
  getPublicSpecificSubcourse,
} from '../controllers/publicController.js';

const router = express.Router();

router.get('/courses', getPublicCourses);
router.get('/courses/:courseId', getPublicSpecificCourse);

router.get('/courses/:courseId/subcourses', getPublicSubcourses);
router.get('/courses/:courseId/subcourses/:subCourseId', getPublicSpecificSubcourse);

export default router;