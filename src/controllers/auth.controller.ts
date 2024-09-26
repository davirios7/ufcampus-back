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
  const { registration, password } = req.body;

  if (!registration || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Matrícula e Senha são obrigatórios.',
    });
  }

  if (typeof registration !== 'number') {
    return res.status(400).json({
      status: 400,
      message: 'Matrícula deve ser um número.',
    });
  }

  try {
    const user = await User.findOne({ registration });

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'Matrícula ou Senha inválidos.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: 'Matrícula ou Senha inválidos.',
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.cookie('acessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600000,
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

export const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password, registration, username } = req.body;

  if (!username || !password || !email || !registration) {
    return res.status(400).json({
      status: 400,
      message: 'E-mail, usuário, senha e matrícula são obrigatórios.',
    });
  }

  if (typeof registration !== 'number') {
    return res.status(400).json({
      status: 400,
      message: 'Matrícula deve ser um número.',
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: 'E-mail já cadastrado.',
      });
    }

    const existingRegistration = await User.findOne({ registration });

    if (existingRegistration) {
      return res.status(400).json({
        status: 400,
        message: 'Matrícula já cadastrada.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      registration,
    });

    await newUser.save();

    return res.status(200).json({
      status: 200,
      message: 'Usuário criado com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
      error: error.message,
    });
  }
};
