import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model'; // Importa o modelo User

export const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, senha, matricula, nome } = req.body;

  // Validação de dados
  if (!nome || !senha || !email) {
    return res.status(400).json({
      status: 400,
      message: 'E-mail, usuário e senha são obrigatórios.',
    });
  }

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: 'E-mail já cadastrado.',
      });
    }

    // Verifica se o usuário já existe
    const existingMatricula = await User.findOne({ matricula });

    if (existingMatricula) {
      return res.status(400).json({
        status: 400,
        message: 'Matrícula já cadastrada.',
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criação do novo usuário
    const newUser = new User({
      email,
      nome,
      senha: hashedPassword,
      matricula, 
    });

    await newUser.save();

    return res.status(201).json({
      status: 201,
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