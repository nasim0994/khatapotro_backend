import { catchAsync } from '../../utils/catchAsync';
import {
  deleteUserService,
  getAllUserService,
  getSingleUserService,
  permanentDeleteUserService,
  updatePasswordBySuperUserService,
  updatePasswordService,
  updateProfileService,
  updateUserService,
} from './userService';

export const getAllUserController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllUserService(req.query);

  res.status(200).json({
    success: true,
    message: 'User get successfully',
    meta,
    data,
  });
});

export const getSingleUserController = catchAsync(async (req, res) => {
  const result = await getSingleUserService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User get successfully',
    data: result,
  });
});

export const updateUserController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateUserService(id, data);

  res.status(200).json({
    success: true,
    message: 'User update successfully',
    data: result,
  });
});

export const deleteUserController = catchAsync(async (req, res) => {
  const id = req.params.id;

  await deleteUserService(id);
  res.status(200).json({
    success: true,
    message: 'User delete successfully',
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

export const permanentDeleteUserController = catchAsync(async (req, res) => {
  const id = req.params.id;

  await permanentDeleteUserService(id);
  res.status(200).json({
    success: true,
    message: 'user delete successfully',
  });
});

export const updatePasswordBySuperUserController = catchAsync(
  async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    const result = await updatePasswordBySuperUserService(id, body);
    res.status(200).json({
      success: true,
      message: 'Password update successfully',
      data: result,
    });
  },
);
