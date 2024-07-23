import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

import { StatusCodes } from "http-status-codes";
import { Errors } from "../config/errors";

export function validateData(
  schema: z.ZodObject<any, any>,
  isParams: boolean = false,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isParams) {
        schema.parse(req.params);
      } else {
        schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json(errorMessages[0]);
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: Errors.InternalServer });
      }
    }
  };
}
