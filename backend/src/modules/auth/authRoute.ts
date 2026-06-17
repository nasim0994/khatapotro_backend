import express from 'express';
import verifyValidate from '../../middlewares/verifyValidate';
import { loginValidation } from './authValidation';
import { loginAdminController } from './authController';

const Router = express.Router();

Router.post('/login', verifyValidate(loginValidation), loginAdminController);

export const authRoute = Router;
