import { catchAsync } from '../../utils/catchAsync';
import {
  forgotPasswordService,
  loginUserService,
  registerUserService,
  resendOtpService,
  setNewPasswordService,
  verifyRegisterOtpService,
} from './userAuthService';
import httpStatus from 'http-status';

export const registerUserController = catchAsync(async (req, res) => {
  const result = await registerUserService(req.body);

  res.status(200).json({
    success: true,
    message:
      'Verification OTP send success. please check your email inbox or spam folder',
  });
});

export const verifyRegisterOtpController = catchAsync(async (req, res) => {
  const result = await verifyRegisterOtpService(req.body);

  res.status(200).json({
    success: true,
    message: 'Verification successfully',
    data: result,
  });
});

export const resendOtpController = catchAsync(async (req, res) => {
  const { email } = req.body;

  await resendOtpService(email);

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
  });
});

export const loginUserController = catchAsync(async (req, res) => {
  const result = await loginUserService(req.body);
  const { accessToken } = result;

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
    },
  });
});

export const forgotPasswordController = catchAsync(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordService(email);

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'OTP sent to your email',
  });
});

export const setNewPasswordController = catchAsync(async (req, res) => {
  const { email, otp, password } = req.body;
  await setNewPasswordService(email, otp, password);

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password reset successfully',
  });
});
