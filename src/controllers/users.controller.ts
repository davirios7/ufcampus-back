import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import Tarefa from '../models/tarefa.model';

export const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password, registration, username } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      status: 400,
      message: 'E-mail, usuário e password são obrigatórios.',
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

    const existingregistration = await User.findOne({ registration });

    if (existingregistration) {
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

export const createTarefa = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { title, description, startDate, endDate, id_user } = req.body;

  if (!title || !startDate || !endDate) {
    return res.status(400).json({
      status: 400,
      message: 'Título e Data são obrigatórios.',
    });
  }

  try {
    const existingUser = await User.findById(id_user);

    if (!existingUser) {
      return res.status(400).json({
        status: 400,
        message: 'Usuário não encontrado.',
      });
    }

    const newTarefa = new Tarefa({
      title,
      description,
      startDate,
      endDate,
      id_user,
    });

    await newTarefa.save();

    return res.status(200).json({
      status: 200,
      message: 'Tarefa criada com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
      error: error.message,
    });
  }

}