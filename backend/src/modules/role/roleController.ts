import { catchAsync } from '../../utils/catchAsync';
import {
  addRoleService,
  deleteRoleService,
  getAllRoleService,
  getSingleRoleService,
  updateRoleService,
} from './roleService';

export const addRoleController = catchAsync(async (req, res) => {
  const result = await addRoleService(req.body);

  res.status(200).json({
    success: true,
    message: 'role add successfully',
    data: result,
  });
});

export const getAllRoleController = catchAsync(async (req, res) => {
  const result = await getAllRoleService();

  res.status(200).json({
    success: true,
    message: 'role get successfully',
    data: result,
  });
});

export const getSingleRoleController = catchAsync(async (req, res) => {
  const result = await getSingleRoleService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'role get successfully',
    data: result,
  });
});

export const updateRoleController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateRoleService(id, data);

  res.status(200).json({
    success: true,
    message: 'role update successfully',
    data: result,
  });
});

export const deleteRoleController = catchAsync(async (req, res) => {
  const id = req.params.id;
  await deleteRoleService(id);
  res.status(200).json({
    success: true,
    message: 'role delete successfully',
  });
});
