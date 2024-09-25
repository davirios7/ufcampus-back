import express from 'express';
import { sendEmail } from '../controllers/email.controller';
const router = express.Router();

router.post('/enviar_email', sendEmail);

export default router;
