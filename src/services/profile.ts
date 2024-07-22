import { Response, Request } from "express";
import { prismaClient } from "..";
import { authenticate } from "../middleware/authenticate";



// get user profile
export const getProfile = async (req: Request, res: Response) => {
    
    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }

    try {
        const user = await prismaClient.user.findFirst({
            where:{
                id: payload.userId
            },
            include:{
                profile:true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(404).json({message: 'User is not found'});
        return;
    }
}


// update user profile
export const updateProfile = async (req:Request, res:Response) => {
    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }

    const {bio} = req.body;

    try {
        const profile = await prismaClient.profile.update({
            where:{
                userId: payload.userId
            },
            data:{
                bio
            }
        });
        res.json(profile);
    } catch (error) {
        res.status(404).json({message: 'Profile is not found'});
        return;
    }
}
