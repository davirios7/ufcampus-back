import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import emailRoutes from './routes/email';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Express = express();

app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', emailRoutes);

app.use((_req, res, _next) => {
  const error = new Error('404 Not found');
  return res.status(404).json({
    message: error.message,
  });
});

const connectToMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI || '';
    await mongoose.connect(uri);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};

const httpServer = http.createServer(app);
const PORT = 3001;
httpServer.listen(PORT, async () => {
  await connectToMongo();
});
