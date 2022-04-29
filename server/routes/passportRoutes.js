import express from 'express';
import {
  google,
  googleCallback,
  passportLogout,
} from '../controller/passportController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', google);
router.get('/google/callback', googleCallback);
router.get('/logout', passportLogout);

export default router;
