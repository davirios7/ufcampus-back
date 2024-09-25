import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Recupera a chave secreta do JWT das variáveis de ambiente
const jwtSecret = process.env.JWTSECRET;

// Verifica se a chave JWT está definida, caso contrário, lança um erro
if (!jwtSecret) {
  throw new Error('JWTSECRET não está definida no arquivo .env');
}

export const authLogin = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Desestrutura os campos email e password do corpo da requisição
  const { email, password } = req.body;

  // Validação de dados: Verifica se o email e a senha foram fornecidos
  if (!email || !password) {
    // Retorna uma resposta 400 (Bad Request) se faltar email ou senha
    return res.status(400).json({
      status: 400,
      message: 'E-mail e Senha são obrigatórios.',
    });
  }

  try {
    
    const user = 'true'

    // Se o usuário não for encontrado, retorna uma resposta 401 (Unauthorized)
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'E-mail ou Senha inválidos.',
      });
    }

    // Compara a senha fornecida com a senha armazenada no banco de dados
    const isPasswordValid = await bcrypt.compare(password, user);

    // Se a senha estiver incorreta, retorna uma resposta 401 (Unauthorized)
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: 'E-mail ou Senha inválidos.',
      });
    }

    // Gera o token de acesso JWT com um tempo de expiração de 1 hora
    const token = jwt.sign(
      { userId: user, username: user, email: user },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Gera o token de refresh JWT com um tempo de expiração de 1 dia
    const refreshToken = jwt.sign(
      { userId: user, username: user, email: user },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Configura o cookie do accessToken com as opções de segurança
    res.cookie('acessToken', token, {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript (apenas via HTTP)
      secure: true, // O cookie só é enviado em conexões HTTPS
      sameSite: 'lax', // Controla o envio do cookie em requisições entre sites
      maxAge: 3600000, // Define o tempo de vida do cookie para 1 hora
    });

    // Configura o cookie do refreshToken com as opções de segurança
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript (apenas via HTTP)
      secure: true, // O cookie só é enviado em conexões HTTPS
      sameSite: 'lax', // Controla o envio do cookie em requisições entre sites
      maxAge: 86400000, // Define o tempo de vida do cookie para 1 dia
    });

    // Retorna uma resposta 200 (OK) com uma mensagem de sucesso e o token JWT
    return res.status(200).json({
      status: 200,
      message: 'Login bem sucedido!',
      token: token,
    });
  } catch (error) {
    // Captura qualquer erro durante o processo e retorna uma resposta 500 (Internal Server Error)
    return res.status(500).json({
      status: 500,
      message: 'Erro interno do servidor.',
    });
  }
};
