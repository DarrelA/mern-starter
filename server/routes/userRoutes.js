import express from 'express';
import { login } from '../controller/userController.js';

const router = express.Router();

router.get('/', login);

export default router;
