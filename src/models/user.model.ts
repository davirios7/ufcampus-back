import mongoose, { Schema, Document } from 'mongoose';

// Interface para definir o tipo do documento User
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  matricula: string;
}

// Definindo o Schema do Mongoose para User
const UserSchema: Schema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  matricula: {
    type: String,
    required: true,
    unique: true,
  },
});

// Exporta o modelo baseado no schema
export default mongoose.model<IUser>('User', UserSchema);
