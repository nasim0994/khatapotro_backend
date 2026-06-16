import express from 'express';
import {
  addCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
} from './categoryController';
import verifyValidate from '../../middlewares/verifyValidate';
import { categoryValidation } from './categoryValidation';
import { auth } from '../../middlewares/auth';
const Router = express.Router();

Router.post(
  '/add',
  verifyValidate(categoryValidation),
  auth(),
  addCategoryController,
);
Router.get('/all', auth(), getAllCategoryController);
Router.get('/:id', auth(), getSingleCategoryController);
Router.patch('/update/:id', auth(), updateCategoryController);
Router.delete('/delete/:id', auth(), deleteCategoryController);

export const categoryRoute = Router;
