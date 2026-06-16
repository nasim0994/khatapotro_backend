import express from 'express';
import {
  addRoleController,
  deleteRoleController,
  getAllRoleController,
  getSingleRoleController,
  updateRoleController,
} from './roleController';
import verifyValidate from '../../middlewares/verifyValidate';
import { roleUpdateValidation, roleValidation } from './roleValidation';
import { verifyPermission } from '../../middlewares/verifyPermission';
const Router = express.Router();

Router.post(
  '/add',
  verifyPermission('role', 'create'),
  verifyValidate(roleValidation),
  addRoleController,
);
Router.get('/all', verifyPermission('role', 'read'), getAllRoleController);
Router.get('/:id', verifyPermission('role', 'read'), getSingleRoleController);
Router.put(
  '/update/:id',
  verifyPermission('role', 'update'),
  verifyValidate(roleUpdateValidation),
  updateRoleController,
);
Router.delete(
  '/delete/:id',
  verifyPermission('role', 'delete'),
  deleteRoleController,
);

export const roleRoute = Router;
