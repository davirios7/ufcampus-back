import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtSecret = process.env.JWTSECRET;

if (!jwtSecret) {
  throw new Error('JWTSECRET não estão definidas no arquivo .env');
}

export const authenticateToken = (
  req: Request & { user?: string | JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.acessToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: 'Access Token inválido.',
      });
    }
  }
  return res.status(403).json({
    status: 403,
    message: 'Acesso Negado. Usuário não logado.',
  });
};
