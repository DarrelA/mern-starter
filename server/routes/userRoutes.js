import express from 'express';
import {
  deleteProfile,
  getAvatar,
  login,
  logout,
  logoutAll,
  register,
  updateProfile,
  uploadAvatar,
} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import fileUploadMiddleware from '../middleware/fileUploadMiddleware.js';

const router = express.Router();

router.get('/images/:key', getAvatar);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/logoutall', authMiddleware, logoutAll);
router.post('/updateprofile', authMiddleware, updateProfile);
router.post(
  '/uploadavatar',
  authMiddleware,
  fileUploadMiddleware.single('image'),
  uploadAvatar
);
router.post('/deleteprofile', authMiddleware, deleteProfile);

export default router;
