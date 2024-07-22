import {Router} from 'express';
import authRouter from './auth';
import blogRouter from './blog';
import profileRouter from './profile';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/blog', blogRouter);
router.use('/profile', profileRouter)

export default router;