import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
};

export const verifyOTP = async (otp: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(otp, hash);
};

export const generateOTPExpiry = (): Date => {
  const expiryMinutes = parseInt(process.env.OTP_EXP_MINUTES || '10');
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};

export const isOTPExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
