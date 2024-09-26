import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Tarefa from '../models/tarefa.model';

export const createTarefa = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { title, description, startDate, endDate, registration } = req.body;

  if (!title || !startDate || !endDate || !registration) {
    return res.status(400).json({
      status: 400,
      message: 'Título e Data e Matrícula são obrigatórios.',
    });
  }

  if (typeof registration !== 'number') {
    return res.status(400).json({
      status: 400,
      message: 'Matrícula deve ser um número.',
    });
  }

  try {
    const existingUser = await User.findOne({ registration });

    if (!existingUser) {
      return res.status(400).json({
        status: 400,
        message: 'Usuário não encontrado.',
      });
    }

    const user_id: string = existingUser._id as string;
    if (user_id == null) {
      return res.status(400).json({
        status: 400,
        message: 'Usuário não encontrado.',
      });
    }

    const id_usuario: string = user_id.toString();

    const newTarefa = new Tarefa({
      title,
      description,
      startDate,
      endDate,
      registration: id_usuario,
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
};

export const editTarefa = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id_tarefa, title, description, startDate, endDate } = req.body;

  if (!id_tarefa || !title || !startDate || !endDate) {
    return res.status(400).json({
      status: 400,
      message: 'ID, Título e Data são obrigatórios.',
    });
  }

  try {
    const existingTarefa = await Tarefa.findOne({ _id: id_tarefa });

    if (!existingTarefa) {
      return res.status(400).json({
        status: 400,
        message: 'Tarefa não encontrada.',
      });
    }

    await Tarefa.updateOne(
      { id_tarefa },
      {
        title,
        description,
        startDate,
        endDate,
      }
    );

    return res.status(200).json({
      status: 200,
      message: 'Tarefa editada com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
      error: error.message,
    });
  }
};

export const getTarefas = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { registration } = req.query;

  if (!registration) {
    return res.status(400).json({
      status: 400,
      message: 'Matrícula é obrigatória.',
    });
  }

  try {
    const existingUser = await User.findOne({ registration });

    if (!existingUser) {
      return res.status(400).json({
        status: 400,
        message: 'Usuário não encontrado.',
      });
    }

    const user_id: string = existingUser._id as string;
    if (user_id == null) {
      return res.status(400).json({
        status: 400,
        message: 'Usuário não encontrado.',
      });
    }

    const id_usuario: string = user_id.toString();

    const tarefas = await Tarefa.find({ registration: id_usuario });

    if (tarefas.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Nenhuma tarefa encontrada.',
      });
    }

    return res.status(200).json({
      status: 200,
      tarefas,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
      error: error.message,
    });
  }
};

export const deleteTarefa = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id_tarefa } = req.body;

  if (!id_tarefa) {
    return res.status(400).json({
      status: 400,
      message: 'ID é obrigatório.',
    });
  }

  try {
    const existingTarefa = await Tarefa.findOne({ _id: id_tarefa });

    if (!existingTarefa) {
      return res.status(400).json({
        status: 400,
        message: 'Tarefa não encontrada.',
      });
    }

    await Tarefa.deleteOne({ id_tarefa });

    return res.status(200).json({
      status: 200,
      message: 'Tarefa excluída com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
      error: error.message,
    });
  }
};
