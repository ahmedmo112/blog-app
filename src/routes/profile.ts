import { Router } from "express";
import { getProfile, updateProfile } from "../services/profile";
import { validateData } from "../middleware/validationMiddleware";
import { updateProfileSchema } from "../schemas/profileSchemas";
import { authenticate } from "../middleware/authenticate";

const profileRouter: Router = Router();

profileRouter.get("/",authenticate, getProfile);

profileRouter.put("/",authenticate, validateData(updateProfileSchema), updateProfile);

export default profileRouter;
