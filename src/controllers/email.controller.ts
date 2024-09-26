import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import Tarefa from '../models/tarefa.model';
import cron from 'node-cron';

export const sendEmail = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, id_tarefa } = req.body;
  try {
    const tarefa = await Tarefa.findOne({ _id: id_tarefa });

    if (!tarefa) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    const endDate = tarefa.endDate;
    if (!endDate) {
      throw new Error('Hora de Término não definida');
    }

    const hora_envio = new Date(endDate);
    hora_envio.setHours(hora_envio.getHours() - 1);
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Seu Lembrete da Tarefa ${tarefa.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="background-color: #f8f9fa; padding: 10px; border-bottom: 1px solid #ddd;">Alerta de Tarefa</h1>
          <p>Olá,</p>
          <p>Este é um lembrete de que a tarefa <strong>"${tarefa.title}"</strong> começará em uma hora.</p>
          <p>Por favor, esteja preparado para iniciar a tarefa no horário programado.</p>
          <p>Atenciosamente,<br>Sua Equipe de Gerenciamento de Tarefas</p>
          <footer style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 0.9em; color: #777;">
            <p>Este é um e-mail automático, por favor, não responda.</p>
          </footer>
        </div>
      `,
    };

    const cronExpression = `${hora_envio.getMinutes()} ${hora_envio.getHours()} ${hora_envio.getDate()} ${hora_envio.getMonth()} *`;

    cron.schedule(cronExpression, async () => {
      try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso!');
      } catch (error) {
        console.error(`Falha ao enviar e-mail: ${error}`);
      }
    });

    res.status(200).json({ message: 'E-mail agendado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: `Falha ao agendar e-mail: ${error}` });
  }
};