import { catchAsync } from '../../utils/catchAsync';
import {
  addCategoryService,
  deleteCategoryService,
  getAllCategoryService,
  getSingleCategoryService,
  updateCategoryService,
} from './categoryService';

export const addCategoryController = catchAsync(async (req, res) => {
  const result = await addCategoryService(req.body, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Category add successfully',
    data: result,
  });
});

export const getAllCategoryController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllCategoryService(req.query);

  res.status(200).json({
    success: true,
    message: 'Category get successfully',
    meta,
    data,
  });
});

export const getSingleCategoryController = catchAsync(async (req, res) => {
  const result = await getSingleCategoryService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Category get successfully',
    data: result,
  });
});

export const updateCategoryController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateCategoryService(id, data);

  res.status(200).json({
    success: true,
    message: 'Category update successfully',
    data: result,
  });
});

export const deleteCategoryController = catchAsync(async (req, res) => {
  const id = req.params.id;

  await deleteCategoryService(id);
  res.status(200).json({
    success: true,
    message: 'Category delete successfully',
  });
});
