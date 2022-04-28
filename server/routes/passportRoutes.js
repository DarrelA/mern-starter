import express from 'express';
import {
  googleOauth20,
  googleOauth20Callback,
  passportLogout,
} from '../controller/passportController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', googleOauth20);
router.get('/google/callback', googleOauth20Callback);
router.get('/logout', passportLogout);

router.get('/protected', authMiddleware, (req, res) => res.send('hi')); // for testing

export default router;
