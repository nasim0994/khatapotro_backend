import { catchAsync } from '../../utils/catchAsync';
import {
  getUserBalanceService,
  transactionStatisticsService,
} from './reportService';

export const getUserBalanceController = catchAsync(async (req, res) => {
  const result = await getUserBalanceService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User balance get success',
    data: result,
  });
});

export const transactionStatisticsController = catchAsync(async (req, res) => {
  const query = {
    type: req.query.type as 'income' | 'expense',
    month: req.query.month as string,
  };

  const result = await transactionStatisticsService(req.params.id, query);

  res.status(200).json({
    success: true,
    message: 'statistic get success',
    data: result,
  });
});
