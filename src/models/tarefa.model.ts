import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model'; // Importe a interface IUser

// Interface para definir o tipo do documento Tarefa
export interface ITarefa extends Document {
  titulo: string;
  descricao: string;
  data: Date;
  id_user: IUser['_id']; // Referência ao ID do usuário
}

// Definindo o Schema do Mongoose para Tarefa
const TarefaSchema: Schema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Faz referência ao modelo User
    required: true,
  },
});

// Exporta o modelo baseado no schema
export default mongoose.model<ITarefa>('Tarefa', TarefaSchema);
