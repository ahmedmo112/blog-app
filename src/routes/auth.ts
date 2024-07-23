import { Router } from "express";
import { login, signup } from "../services/auth";
import { validateData } from "../middleware/validationMiddleware";
import { userLoginSchema, userSignupSchema } from "../schemas/authSchemas";

const authRouter: Router = Router();

authRouter.post("/signup", validateData(userSignupSchema), signup);
authRouter.post("/login", validateData(userLoginSchema), login);

export default authRouter;
