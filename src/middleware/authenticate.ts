import { Response, Request, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Errors } from "../config/errors";

export const authenticate = (req: Request, res: Response, next:NextFunction): any => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: Errors.TokenRequired});
  }

  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as any;
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: Errors.InvalidToken});
  }
};
