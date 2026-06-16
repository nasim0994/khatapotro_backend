import express from 'express';
import {
  deleteUserController,
  getAllUserController,
  getSingleUserController,
  permanentDeleteUserController,
  updatePasswordBySuperUserController,
  updatePasswordController,
  updateProfileController,
  updateUserController,
} from './userController';
import { verifyPermission } from '../../middlewares/verifyPermission';
import { auth } from '../../middlewares/auth';
const Router = express.Router();

Router.get('/all', verifyPermission('user', 'read'), getAllUserController);
Router.get('/:id', auth(), getSingleUserController);
Router.put('/update/:id', auth(), updateUserController);
Router.patch('/update/profile/:id', updateProfileController);
Router.patch('/update/password/:id', updatePasswordController);
Router.put(
  '/update/password/by-superUser/:id',
  updatePasswordBySuperUserController,
);
Router.delete('/delete/:id', auth(), deleteUserController);
Router.delete('/delete/permanent/:id', auth(), permanentDeleteUserController);

export const userRoute = Router;
