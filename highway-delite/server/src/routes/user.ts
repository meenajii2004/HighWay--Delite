import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /user/me - Get current user info
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      dateOfBirth: req.user.dateOfBirth,
      provider: req.user.provider,
      createdAt: req.user.createdAt,
    },
  });
});

export default router;
