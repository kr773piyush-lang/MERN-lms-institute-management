import { EnrollmentService } from '../services/EnrollmentService.js';
import { catchAsync } from '../utils/errors.js';
import { enrollmentValidation } from '../validations/enrollmentValidation.js';

const enrollmentService = new EnrollmentService();

export const enrollStudent = catchAsync(async (req, res) => {
  const { error, value } = enrollmentValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const enrollment = await enrollmentService.enrollStudent(
    value,
    req.user.instituteId
  );

  res.status(201).json({
    success: true,
    message: 'Student enrolled successfully',
    data: enrollment,
  });
});

export const getEnrollments = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const filters = {
    ...(req.query.enrollmentStatus && {
      enrollmentStatus: req.query.enrollmentStatus,
    }),
  };

  const result = await enrollmentService.getEnrollments(
    req.user.instituteId,
    page,
    limit,
    filters
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getStudentEnrollments = catchAsync(async (req, res) => {
  const enrollments = await enrollmentService.getStudentEnrollments(
    req.params.userId
  );

  res.status(200).json({
    success: true,
    data: enrollments,
  });
});

export const updateEnrollmentStatus = catchAsync(async (req, res) => {
  const { enrollmentStatus } = req.body;

  if (!enrollmentStatus) {
    return res.status(400).json({
      success: false,
      message: 'Enrollment status is required',
    });
  }

  const enrollment = await enrollmentService.updateEnrollmentStatus(
    req.params.enrollmentId,
    enrollmentStatus
  );

  res.status(200).json({
    success: true,
    message: 'Enrollment status updated',
    data: enrollment,
  });
});

export const getEnrollmentStats = catchAsync(async (req, res) => {
  const stats = await enrollmentService.getEnrollmentStats(
    req.user.instituteId
  );

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const issueCertificate = catchAsync(async (req, res) => {
  const { certificateUrl } = req.body;

  if (!certificateUrl) {
    return res.status(400).json({
      success: false,
      message: 'Certificate URL is required',
    });
  }

  const enrollment = await enrollmentService.issueCertificate(
    req.params.enrollmentId,
    certificateUrl
  );

  res.status(200).json({
    success: true,
    message: 'Certificate issued',
    data: enrollment,
  });
});
