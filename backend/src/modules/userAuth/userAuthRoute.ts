import express from 'express';
import verifyValidate from '../../middlewares/verifyValidate';
import { userAuthValidation } from './userAuthValidation';
import {
  forgotPasswordController,
  loginUserController,
  registerUserController,
  resendOtpController,
  setNewPasswordController,
  verifyRegisterOtpController,
} from './userAuthController';
import { userValidation } from '../user/userValidation';

const Router = express.Router();

Router.post(
  '/register',
  verifyValidate(userValidation),
  registerUserController,
);
Router.post('/verification', verifyRegisterOtpController);
Router.post('/resend-otp', resendOtpController);
Router.post('/login', verifyValidate(userAuthValidation), loginUserController);
Router.post('/forgot-password', forgotPasswordController);
Router.post('/set-password', setNewPasswordController);

export const userAuthRoute = Router;
