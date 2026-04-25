import { ApprovalService } from '../services/ApprovalService.js';
import { catchAsync } from '../utils/errors.js';
import {
  approveUserValidation,
  rejectUserValidation,
} from '../validations/approvalValidation.js';

const approvalService = new ApprovalService();

export const getPendingApprovals = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await approvalService.getPendingApprovals(
    req.user.instituteId,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    data: result.approvals,
    pagination: {
      total: result.total,
      page,
      limit,
      pages: result.pages,
    },
  });
});

export const approveUser = catchAsync(async (req, res) => {
  const { error, value } = approveUserValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const approval = await approvalService.approveUser(
    req.params.approvalId,
    req.user.userId,
    value.remarks
  );

  res.status(200).json({
    success: true,
    message: 'User approved successfully',
    data: approval,
  });
});

export const rejectUser = catchAsync(async (req, res) => {
  const { error, value } = rejectUserValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const approval = await approvalService.rejectUser(
    req.params.approvalId,
    req.user.userId,
    value.rejectionReason
  );

  res.status(200).json({
    success: true,
    message: 'User rejected successfully',
    data: approval,
  });
});

export const getApprovalStatus = catchAsync(async (req, res) => {
  const approval = await approvalService.getApprovalStatus(
    req.params.userId
  );

  res.status(200).json({
    success: true,
    data: approval,
  });
});
