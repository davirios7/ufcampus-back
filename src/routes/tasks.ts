import express from 'express';
const router = express.Router();
import { createTarefa, editTarefa, getTarefas, deleteTarefa } from '../controllers/tasks.controller';

router.post('/criar_tarefa', createTarefa);
router.post('/editar_tarefa', editTarefa);
router.get('/obter_tarefas', getTarefas);
router.delete('/excluir_tarefa', deleteTarefa);

export default router;
