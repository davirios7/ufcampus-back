import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';


const jwtSecret = process.env.JWTSECRET;

if (!jwtSecret) {
  throw new Error('JWTSECRET não está definida no arquivo .env');
}

export const authLogin = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password, matricula } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'E-mail e Senha são obrigatórios.',
    });
  }

  try {
    
    const user = 'true'

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'E-mail ou Senha inválidos.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: 'E-mail ou Senha inválidos.',
      });
    }

    const token = jwt.sign(
      { userId: user, username: user, email: user },
      jwtSecret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user, username: user, email: user },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.cookie('acessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 86400000,
    });

    return res.status(200).json({
      status: 200,
      message: 'Login bem sucedido!',
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
    });
  }
};
