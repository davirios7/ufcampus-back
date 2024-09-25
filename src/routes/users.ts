import express from 'express';
import { createUser } from '../controllers/users.controller';
const router = express.Router();

// Rotas de usuários
router.post('/cadastrar', createUser);

export default router;
