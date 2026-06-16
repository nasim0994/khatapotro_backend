import express from 'express';
import {
  addAdminController,
  deleteAdminController,
  getAllAdminController,
  getSingleAdminController,
  updatePasswordBySuperAdminController,
  updatePasswordController,
  updateProfileController,
  updateAdminController,
} from './adminController';
import verifyValidate from '../../middlewares/verifyValidate';
import { adminValidation } from './adminValidation';
import { verifyPermission } from '../../middlewares/verifyPermission';
const Router = express.Router();

Router.post(
  '/add',
  verifyPermission('admin', 'create'),
  verifyValidate(adminValidation),
  addAdminController,
);
Router.get('/all', verifyPermission('admin', 'read'), getAllAdminController);
Router.get('/:id', verifyPermission('admin', 'read'), getSingleAdminController);
Router.put(
  '/update/:id',
  verifyPermission('admin', 'update'),
  updateAdminController,
);
Router.put('/update/profile/:id', updateProfileController);
Router.put('/update/password/:id', updatePasswordController);
Router.put(
  '/update/password/by-superAdmin/:id',
  updatePasswordBySuperAdminController,
);

Router.delete(
  '/delete/:id',
  verifyPermission('admin', 'delete'),
  deleteAdminController,
);

export const adminRoute = Router;
