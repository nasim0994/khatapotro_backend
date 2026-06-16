import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken, verifyToken } from '../../utils/createToken';
import { ILoginAdmin } from './authInterface';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import { Admin } from '../admin/adminModel';

export const loginAdminService = async (payload: ILoginAdmin) => {
  // checking if the admin is exist
  const admin = await Admin.findOne({ email: payload?.email })
    .select('+password')
    .populate('rolePermission');

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'This admin is not found !');
  }

  // checking if the admin is blocked
  const status = admin?.status;

  if (status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is blocked !');
  }

  //checking if the password is correct
  const isMatch = await bcrypt.compare(payload?.password, admin?.password);

  if (!isMatch)
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the client
  const jwtPayload = {
    _id: admin?._id,
    email: admin?.email,
    name: admin?.name,
    role: admin?.role,
    rolePermission: admin?.rolePermission,
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

export const refreshTokenService = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.JWT_REFRESH_SECRET as string);

  const { email } = decoded;

  // checking if the admin is exist
  const admin = await Admin.findOne({ email }).populate('rolePermission');

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'This admin is not found !');
  }

  // checking if the admin is blocked
  const status = admin?.status;

  if (status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This admin is blocked !');
  }

  const jwtPayload = {
    _id: admin?._id,
    email: admin?.email,
    name: admin?.name,
    role: admin?.role,
    rolePermission: admin?.rolePermission,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return {
    accessToken,
  };
};
