import express from 'express';
import { authLogin, createUser } from '../controllers/auth.controller';
const router = express.Router();

router.post('/login', authLogin);
router.post('/cadastrar', createUser);

export default router;
