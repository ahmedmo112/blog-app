import { Request , Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync} from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// login user
export const login = async (req: Request, res: Response)=>{
    const {email, password} = req.body;
    
    //apply validation

    let user = await prismaClient.user.findFirst({
        where:{
            email
        }
    });

    if(!user){
        res.status(404).json({message: 'User not found'});
        return;
    }

    if(!compareSync(password, user.password)){
        res.status(401).json({message: 'Invalid password'});
        return;
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '1h'});

    res.json({user, token});
}


// signup user
export const signup = async (req: Request, res: Response)=>{
    const {name,email,password} = req.body;

    //apply validation

    let user = await prismaClient.user.findFirst({
        where:{
            email
        }
    });

    if(user){
        res.status(409).json({message: 'User already exists'});
        return;
    }

    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password: hashSync(password, 10),
            profile: {
                create: {
                    bio : ""
                }
            }
        },
    })

    res.json(user);
}