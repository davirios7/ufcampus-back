import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

const jwtSecret = process.env.JWTSECRET;

if (!jwtSecret) {
  throw new Error('JWTSECRET não está definido no arquivo .env');
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'E-mail e senha são obrigatórios.',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'Usuário não encontrado.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        message: 'Senha incorreta.',
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return res.status(200).json({
      status: 200,
      message: 'Login realizado com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
      error: error.message,
    });
  }
};
