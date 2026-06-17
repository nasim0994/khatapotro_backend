import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/createToken';
import { ILoginUser } from './userAuthInterface';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import { User } from '../user/userModel';
import { IUser } from '../user/userInterface';
import mongoose from 'mongoose';
import { sendMail } from '../../utils/sendMail';

export const registerUserService = async (data: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne({ email: data.email }).session(
      session,
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    let user;

    if (existingUser) {
      if (existingUser.status !== 'pending') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists');
      }

      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      user = await existingUser.save({ session });
    } else {
      const [createdUser] = await User.create(
        [
          {
            ...data,
            otp,
            status: 'pending',
            otpExpires,
          },
        ],
        { session },
      );

      user = createdUser;
    }

    await sendMail({
      to: user.email,
      subject: 'Verify your email',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    await session.commitTransaction();

    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const verifyRegisterOtpService = async (data: {
  email: string;
  otp: string;
}) => {
  const user = await User.findOne({ email: data?.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.otp !== data?.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (!user?.otpExpires || user?.otpExpires < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  user.status = 'active';
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  const jwtPayload = {
    _id: user?._id,
    email: user?.email,
    name: user?.name,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return accessToken;
};

export const resendOtpService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === 'active') {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already verified');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendMail({
    to: user.email,
    subject: 'Verify your email',
    html: `
      <h2>Email Verification</h2>
      <p>Your new OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });

  return null;
};

export const loginUserService = async (payload: ILoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is blocked
  const status = user?.status;

  if (status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is not exist !');
  }

  //checking if the password is correct
  const isMatch = await bcrypt.compare(payload?.password, user?.password);

  if (!isMatch)
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the client
  const jwtPayload = {
    _id: user?._id,
    email: user?.email,
    name: user?.name,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES_IN as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendMail({
    to: user.email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });

  return {
    message: 'OTP sent to your email',
  };
};

export const setNewPasswordService = async (
  email: string,
  otp: string,
  password: string,
) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (!user.otp || user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  user.password = password;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  return {
    message: 'Password reset successfully',
  };
};
