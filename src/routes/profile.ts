import { Router } from "express";
import { getProfile, updateProfile } from "../services/profile";


const profileRouter: Router = Router();

profileRouter.get('/', getProfile);

profileRouter.put('/', updateProfile);

export default profileRouter;
