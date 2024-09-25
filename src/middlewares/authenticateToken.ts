import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtSecret = process.env.JWTSECRET;
const refreshTokenSecret = process.env.JWTSECRET_REFRESH;

if (!jwtSecret || !refreshTokenSecret) {
  throw new Error(
    'JWTSECRET ou JWTSECRET_REFRESH não estão definidas no arquivo .env'
  );
}

export const authenticateToken = (
  req: Request & { user?: string | JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.acessToken;
  const refreshToken = req.cookies.refreshToken;

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
  } else if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);

      if (
        typeof decoded === 'object' &&
        'userId' in decoded &&
        'username' in decoded &&
        'email' in decoded
      ) {
        req.user = decoded;

        res.cookie('refreshToken', '', {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 0,
        });

        const newAccessToken = jwt.sign(
          {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
          },
          jwtSecret,
          { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
          {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
          },
          refreshTokenSecret,
          { expiresIn: '1d' }
        );

        res.cookie('acessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 3600000,
        });

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 86400000,
        });

        return next();
      } else {
        return res.status(401).json({
          status: 401,
          message: 'Refresh Token não contém as informações necessárias.',
        });
      }
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: 'Refresh Token inválido.',
      });
    }
  }
  return res.status(403).json({
    status: 403,
    message: 'Acesso Negado. Usuário não logado.',
  });
};
