import express from 'express';
import { authLogin } from '../controllers/auth.controller';
const router = express.Router();

router.post('/login', authLogin);

export default router;
