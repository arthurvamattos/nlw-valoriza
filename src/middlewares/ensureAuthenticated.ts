import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Receber o token
  const authToken = request.headers.authorization;

  // Validar se o token esté preenchido
  if (!authToken) {
    return response.status(401).end();
  }

  const [, token] = authToken.split(" ");

  // Validar o token
  try {
    const { sub } = verify(token, process.env.TOKEN_SECRET) as IPayload;

    // Recuperar informações do usuário
    request.user_id = sub;

    return next();
  } catch (error) {
    return response.status(401).end();
  }
}
