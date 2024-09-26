import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import Tarefa from '../models/tarefa.model';

export const sendEmail = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, id_tarefa } = req.body;
  try {

    const tarefa = await Tarefa.findOne({ _id: id_tarefa });

    const hora_envio = (tarefa?.endDate?.getTime() ?? 0) - (1 * 60 * 60 * 1000);

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
      subject: `Seu Lembrete da Tarefa ${tarefa?.title}`,
      text: 'teste',
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: `Falha ao enviar e-mail: ${error}` });
  }
};
