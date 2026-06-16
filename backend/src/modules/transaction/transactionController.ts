import { catchAsync } from '../../utils/catchAsync';
import {
  addTransactionService,
  deleteTransactionService,
  getAllTransactionService,
  getSingleTransactionService,
  updateTransactionService,
} from './transactionService';

export const addTransactionController = catchAsync(async (req, res) => {
  const result = await addTransactionService(req.body, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Transaction add successfully',
    data: result,
  });
});

export const getAllTransactionController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllTransactionService(req.query);

  res.status(200).json({
    success: true,
    message: 'Transaction get successfully',
    meta,
    data,
  });
});

export const getSingleTransactionController = catchAsync(async (req, res) => {
  const result = await getSingleTransactionService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Transaction get successfully',
    data: result,
  });
});

export const updateTransactionController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateTransactionService(id, data);

  res.status(200).json({
    success: true,
    message: 'Transaction update successfully',
    data: result,
  });
});

export const deleteTransactionController = catchAsync(async (req, res) => {
  const id = req.params.id;

  await deleteTransactionService(id);
  res.status(200).json({
    success: true,
    message: 'Transaction delete successfully',
  });
});
