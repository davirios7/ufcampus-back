import express from 'express';
import { createUser, createTarefa } from '../controllers/users.controller';
const router = express.Router();

router.post('/cadastrar', createUser);
router.post('/criar_tarefa', createTarefa);

export default router;
