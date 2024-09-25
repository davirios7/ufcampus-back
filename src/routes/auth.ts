import express from 'express';
import { authLogin } from '../controllers/auth.controller';
const router = express.Router();

// Rotas de autenticação
router.post('/login', authLogin);

export default router;
