import { generateOTP, hashOTP, verifyOTP, generateOTPExpiry, isOTPExpired } from '../otp.js';

describe('OTP Utils', () => {
  describe('generateOTP', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOTP();
      expect(otp).toHaveLength(6);
      expect(otp).toMatch(/^\d{6}$/);
    });

    it('should generate different OTPs', () => {
      const otp1 = generateOTP();
      const otp2 = generateOTP();
      expect(otp1).not.toBe(otp2);
    });
  });

  describe('hashOTP and verifyOTP', () => {
    it('should hash and verify OTP correctly', async () => {
      const otp = '123456';
      const hash = await hashOTP(otp);
      
      expect(hash).not.toBe(otp);
      expect(await verifyOTP(otp, hash)).toBe(true);
      expect(await verifyOTP('654321', hash)).toBe(false);
    });
  });

  describe('generateOTPExpiry', () => {
    it('should generate future expiry date', () => {
      const expiry = generateOTPExpiry();
      const now = new Date();
      
      expect(expiry.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('isOTPExpired', () => {
    it('should return true for expired date', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      expect(isOTPExpired(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
      expect(isOTPExpired(futureDate)).toBe(false);
    });
  });
});
