import express from 'express';
const router = express.Router();
import {
  createTarefa,
  editTarefa,
  getTarefas,
  deleteTarefa,
} from '../controllers/tasks.controller';

router.get('/obter_tarefas', getTarefas);
router.post('/criar_tarefa', createTarefa);
router.put('/editar_tarefa', editTarefa);
router.delete('/excluir_tarefa', deleteTarefa);

export default router;
