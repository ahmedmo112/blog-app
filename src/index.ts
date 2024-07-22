import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import router from './routes';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', router);

export const prismaClient: PrismaClient = new PrismaClient(
    {
        log: ['query']
    }
);

app.listen(port, ()=>{
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

