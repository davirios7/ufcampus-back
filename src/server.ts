import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Importe o Mongoose
dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Cria uma instância do aplicativo Express
const app: Express = express();

// Middleware para log das requisições HTTP
app.use(morgan('common'));

// Middleware para parse do corpo das requisições URL-encoded
app.use(express.urlencoded({ extended: true }));

// Middleware para parse do corpo das requisições JSON
app.use(express.json());

// Middleware para parse de cookies
app.use(cookieParser());

// Configuração do CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: 'http://localhost:3000', // Permite solicitações apenas deste domínio (front-end)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permite o envio de cookies e cabeçalhos de autorização
  })
);

// Configura as rotas do aplicativo
app.use('/', authRoutes);
app.use('/', userRoutes);

// Middleware para tratar erros 404 - Página não encontrada
app.use((_req, res, _next) => {
  const error = new Error('404 Not found');
  return res.status(404).json({
    message: error.message,
  });
});

// Conecta ao MongoDB usando Mongoose
const connectToMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI || ''; // Obtém a URI do MongoDB do .env
    await mongoose.connect(uri);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};

// Cria e inicia o servidor HTTP
const httpServer = http.createServer(app);
const PORT = 3001; // Define a porta do servidor
httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`); // Mensagem de confirmação no console
  await connectToMongo(); // Testa a conexão com o MongoDB ao iniciar o servidor
});
