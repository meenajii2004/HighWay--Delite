import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { Otp } from '../models/Otp.js';
import { generateOTP, hashOTP, verifyOTP, generateOTPExpiry, isOTPExpired } from '../utils/otp.js';
import { generateToken } from '../utils/jwt.js';
import { sendOTPEmail } from '../utils/email.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { validateRequest, emailSchema, loginEmailSchema, otpSchema } from '../middleware/validation.js';
import { createError } from '../middleware/errorHandler.js';
import { googleLogin, googleOAuthRedirect } from "../controllers/authController.js";

const router = express.Router();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /auth/signup-email
router.post('/signup-email', validateRequest(emailSchema), async (req, res, next) => {
  try {
    const { email, name, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isActive) {
        throw createError('User already exists', 409, 'USER_EXISTS');
      } else {
        // Delete inactive user and create new one
        await User.findByIdAndDelete(existingUser._id);
        await Otp.deleteMany({ userId: existingUser._id });
      }
    }

    // Create new user (inactive)
    const user = new User({
      email,
      name,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      provider: 'email',
      isActive: false,
    });
    await user.save();

    // Generate and store OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const expiry = generateOTPExpiry();

    const otpRecord = new Otp({
      userId: user._id,
      hash: hashedOTP,
      expiresAt: expiry,
    });
    await otpRecord.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    if (!emailSent) {
      throw createError('Failed to send OTP email', 500, 'EMAIL_ERROR');
    }

    res.status(200).json({
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.post("/google", googleLogin);

// POST /auth/verify-otp
router.post('/verify-otp', validateRequest(otpSchema), async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ userId: user._id });
    if (!otpRecord) {
      throw createError('OTP not found or expired', 400, 'OTP_NOT_FOUND');
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await Otp.findByIdAndDelete(otpRecord._id);
      throw createError('OTP has expired', 400, 'OTP_EXPIRED');
    }

    // Check attempts
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '5');
    if (otpRecord.attempts >= maxAttempts) {
      await Otp.findByIdAndDelete(otpRecord._id);
      throw createError('Too many OTP attempts', 400, 'OTP_MAX_ATTEMPTS');
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.hash);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw createError('Invalid OTP', 400, 'INVALID_OTP');
    }

    // Activate user
    user.isActive = true;
    await user.save();

    // Delete OTP record
    await Otp.findByIdAndDelete(otpRecord._id);

    // Generate JWT token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
      provider: user.provider,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        provider: user.provider,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/login-email
router.post('/login-email', validateRequest(loginEmailSchema), async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email, provider: 'email' });
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw createError('Account not activated', 400, 'ACCOUNT_INACTIVE');
    }

    // Delete existing OTP records
    await Otp.deleteMany({ userId: user._id });

    // Generate and store new OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const expiry = generateOTPExpiry();

    const otpRecord = new Otp({
      userId: user._id,
      hash: hashedOTP,
      expiresAt: expiry,
    });
    await otpRecord.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name);
    if (!emailSent) {
      throw createError('Failed to send OTP email', 500, 'EMAIL_ERROR');
    }

    res.status(200).json({
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/google/start
router.post('/google/start', (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.OAUTH_REDIRECT_URL}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.json({ redirectUrl });
});

router.get("/google/callback", googleOAuthRedirect);

// GET /auth/google/callback
router.get('/google/callback', async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      throw createError('Authorization code not provided', 400, 'MISSING_CODE');
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code as string);
    googleClient.setCredentials(tokens);

    // Get user info from Google
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload()!;
    const { email, name, sub: googleId } = payload;

    if (!email) {
      throw createError('Email not provided by Google', 400, 'GOOGLE_ERROR');
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        email,
        name: name || email.split('@')[0],
        provider: 'google',
        googleId,
        isActive: true,
      });
      await user.save();
    } else {
      // Update existing user if needed
      if (user.provider !== 'google') {
        throw createError('Email already registered with different provider', 409, 'PROVIDER_MISMATCH');
      }
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
      provider: user.provider,
    });

    // Return HTML that closes popup and sends message to parent
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Complete</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              data: {
                token: '${token}',
                user: {
                  id: '${user._id}',
                  email: '${user.email}',
                  name: '${user.name}',
                  dateOfBirth: ${user.dateOfBirth ? `'${user.dateOfBirth.toISOString()}'` : 'null'},
                  provider: '${user.provider}'
                }
              }
            }, '${process.env.CORS_ORIGIN || 'http://localhost:5173'}');
            window.close();
          </script>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    next(error);
  }
});

// POST /auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
