import { Response, Request } from "express";
import * as jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response): any => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return null;
    }

    try {
        const payload = jwt.verify(token!, process.env.JWT_SECRET!) as any;
        return payload; 
    } catch (error) {
        return null;
    }


}