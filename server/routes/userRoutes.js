import express from 'express';
import {
  login,
  logout,
  logoutAll,
  register,
  updateProfile,
  deleteProfile,
} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/logoutall', authMiddleware, logoutAll);
router.post('/updateprofile', authMiddleware, updateProfile);
router.post('/deleteprofile', authMiddleware, deleteProfile);

export default router;
