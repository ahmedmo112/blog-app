import { NextFunction, Router, Request, Response } from "express";
import authRouter from "./auth";
import blogRouter from "./blog";
import profileRouter from "./profile";
import { Errors } from "../config/errors";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/profile", profileRouter);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ message: Errors.ServerError });
});

export default router;
