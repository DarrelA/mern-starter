import express from 'express';
import {
  googleCallback,
  googleRedirect,
  passportLogout,
} from '../controller/passportController.js';

const router = express.Router();

router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);
router.get('/logout', passportLogout);

export default router;
