import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { catchAsync } from '../utils/catchAsync';
import { verifyToken } from '../utils/createToken';
import { User } from '../modules/user/userModel';

export const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(' ')[1];

    // checking if the token is missing
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized! missing token',
      );
    }

    // checking if the given token is valid
    let decoded;
    try {
      decoded = verifyToken(token, config.JWT_ACCESS_SECRET as string);
    } catch {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized! invalid token',
      );
    }

    const { email } = decoded;

    // checking if the user is exist
    const user = await User.findOne({ email });

    if (!user)
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');

    // checking if the user status
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
