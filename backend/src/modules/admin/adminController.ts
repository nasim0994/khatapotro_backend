import { catchAsync } from '../../utils/catchAsync';
import {
  addAdminService,
  bulkBackAdminService,
  deleteAdminService,
  getAllAdminService,
  getSingleAdminService,
  updatePasswordBySuperAdminService,
  updatePasswordService,
  updateProfileService,
  updateAdminService,
} from './adminService';

export const addAdminController = catchAsync(async (req, res) => {
  const result = await addAdminService(req.body);

  res.status(200).json({
    success: true,
    message: 'Admin add successfully',
    data: result,
  });
});

export const getAllAdminController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllAdminService(req.query);

  res.status(200).json({
    success: true,
    message: 'Admin get successfully',
    meta,
    data,
  });
});

export const getSingleAdminController = catchAsync(async (req, res) => {
  const result = await getSingleAdminService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Admin get successfully',
    data: result,
  });
});

export const updateAdminController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateAdminService(id, data);

  res.status(200).json({
    success: true,
    message: 'Admin update successfully',
    data: result,
  });
});

export const deleteAdminController = catchAsync(async (req, res) => {
  const id = req.params.id;

  await deleteAdminService(id, req.body.user);
  res.status(200).json({
    success: true,
    message: 'Admin delete successfully',
  });
});

export const updateProfileController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateProfileService(id, data);

  res.status(200).json({
    success: true,
    message: 'Profile update successfully',
    data: result,
  });
});

export const updatePasswordController = catchAsync(async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const result = await updatePasswordService(id, body);
  res.status(200).json({
    success: true,
    message: 'Password update successfully',
    data: result,
  });
});

export const updatePasswordBySuperAdminController = catchAsync(
  async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    const result = await updatePasswordBySuperAdminService(id, body);
    res.status(200).json({
      success: true,
      message: 'Password update successfully',
      data: result,
    });
  },
);

export const bulkBackAdminController = catchAsync(async (req, res) => {
  const ids = req.body.ids;

  const result = await bulkBackAdminService(ids);
  res.status(200).json({
    success: true,
    message: 'Admins back successfully',
    data: result,
  });
});
