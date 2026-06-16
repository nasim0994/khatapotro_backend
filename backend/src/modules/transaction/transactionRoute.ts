import express from 'express';
import {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionController,
  getSingleTransactionController,
  updateTransactionController,
} from './transactionController';
import verifyValidate from '../../middlewares/verifyValidate';
import { transactionValidation } from './transactionValidation';
import { auth } from '../../middlewares/auth';
const Router = express.Router();

Router.post(
  '/add',
  verifyValidate(transactionValidation),
  auth(),
  addTransactionController,
);
Router.get('/all', auth(), getAllTransactionController);
Router.get('/:id', auth(), getSingleTransactionController);
Router.patch('/update/:id', auth(), updateTransactionController);
Router.delete('/delete/:id', auth(), deleteTransactionController);

export const transactionRoute = Router;
