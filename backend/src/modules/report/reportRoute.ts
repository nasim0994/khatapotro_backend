import express from 'express';
import { auth } from '../../middlewares/auth';
import {
  getUserBalanceController,
  transactionStatisticsController,
} from './reportController';
const Router = express.Router();

Router.get('/balance/:id', auth(), getUserBalanceController);
Router.get('/statistics/:id', transactionStatisticsController);

export const reportRoute = Router;
