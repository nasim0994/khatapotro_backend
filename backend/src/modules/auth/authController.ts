import { catchAsync } from '../../utils/catchAsync';
import { loginAdminService, refreshTokenService } from './authService';
import httpStatus from 'http-status';

export const loginAdminController = catchAsync(async (req, res) => {
  const result = await loginAdminService(req.body);
  const { accessToken } = result;

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin is logged in successfully!',
    data: {
      accessToken,
    },
  });
});

export const refreshTokenController = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await refreshTokenService(refreshToken);

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Token refreshed successfully',
    data: result,
  });
});
