import express from 'express';
import {
  checkRefreshToken,
  deleteProfile,
  fetchPassportUserData,
  getAvatar,
  login,
  logout,
  register,
  updateProfile,
  uploadAvatar,
} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import fileUploadMiddleware from '../middleware/fileUploadMiddleware.js';

const router = express.Router();

router.get('/passport_user', fetchPassportUserData);
router.get('/images/:key', getAvatar);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh_token', checkRefreshToken);
router.post('/updateprofile', authMiddleware, updateProfile);
router.post(
  '/uploadavatar',
  authMiddleware,
  fileUploadMiddleware.single('image'),
  uploadAvatar
);
router.post('/deleteprofile', authMiddleware, deleteProfile);

// /************ DUMMY PROTECTED ROUTE **********************
router.post('/protected', authMiddleware, async (req, res) => {
  try {
    res.send({ data: 'Gained access protected data.' });
  } catch (e) {
    res.json(e.message);
  }
});
// ***********************************************************/

export default router;
