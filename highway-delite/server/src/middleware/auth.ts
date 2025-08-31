import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, extractTokenFromCookie } from '../utils/jwt.js';
import { User } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req) || extractTokenFromCookie(req);

    if (!token) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token is required',
        },
      });
      return;
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).select('-__v');

    if (!user || !user.isActive) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or inactive user',
        },
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }
};
