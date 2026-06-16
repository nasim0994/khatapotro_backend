import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: string | Buffer | object,
  secret: string,
  expiresIn: string,
) => {
  const options = { expiresIn };
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
