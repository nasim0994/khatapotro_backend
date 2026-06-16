export type IUser = {
  email: string;
  name: string;
  password: string;
  image?: string;
  gender?: 'male' | 'female' | null;
  phone?: string;
  status: 'pending' | 'active' | 'blocked';
  isDeleted?: boolean;
  otp?: string;
  otpExpires?: Date;
};
