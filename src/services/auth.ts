import { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Errors } from "../config/errors";

// login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(404).json({ message: Errors.UserNotFound });
    return;
  }

  if (!compareSync(password, user.password)) {
    res.status(401).json({ message: Errors.PasswordNotMatch });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({ user, token });
};

// signup user
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return res.status(409).json({ message: Errors.UserAlraedyExists });
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      profile: {
        create: {
          bio: "",
        },
      },
    },
  });

  res.json(user);
};
