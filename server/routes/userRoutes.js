import express from 'express';
import {
  login,
  logout,
  logoutAll,
  register,
} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/logoutall', authMiddleware, logoutAll);

export default router;
