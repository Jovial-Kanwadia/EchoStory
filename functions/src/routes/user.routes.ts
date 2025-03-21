import { Router } from 'express';
import {
  registerOAuthUser,
  registerGoogleUser,
  registerFacebookUser,
  registerAppleUser,
  verifyToken,
  logout
} from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Generic OAuth registration
router.post('/register/oauth', registerOAuthUser);

// Provider-specific registration endpoints
router.post('/register/google', registerGoogleUser);
router.post('/register/facebook', registerFacebookUser);
router.post('/register/apple', registerAppleUser);

// Token verification endpoint
router.post('/verify-token', verifyToken);

// Logout endpoint
router.post('/logout', authMiddleware, logout);

export default router;