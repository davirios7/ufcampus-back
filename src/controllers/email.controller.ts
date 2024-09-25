import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

export const sendEmail = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email } = req.body;
  try {
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
      subject: 'TESTE',
      text: 'teste',
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: `Falha ao enviar e-mail: ${error}` });
  }
};
