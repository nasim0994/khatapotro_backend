import express from 'express';
import verifyValidate from '../../middlewares/verifyValidate';
import { loginValidation } from './authValidation';
import { loginAdminController, refreshTokenController } from './authController';

const Router = express.Router();

Router.post('/login', verifyValidate(loginValidation), loginAdminController);
Router.post('/refresh-token', refreshTokenController);

export const authRoute = Router;
