import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
export interface ITarefa extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  id_user: IUser['_id'];
}

const TarefaSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<ITarefa>('Tarefa', TarefaSchema);
