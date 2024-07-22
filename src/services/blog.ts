import exp from "constants";
import { prismaClient } from ".."
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { authenticate } from "../middleware/authenticate";

// retrive all posts
export const getAllPosts = async (req:Request, res:Response)=>{
    const posts = await prismaClient.post.findMany({
        where:{
            published: true
        }
    });

    res.json(posts);
}

// retrive single post by id
export const getPost = async (req:Request, res:Response)=>{
    const {id} = req.params;
    
    //check id is number
    if(isNaN(parseInt(id))){
        res.status(400).json({message: 'Invalid post id'});
        return;
    }

    const post = await prismaClient.post.findUnique({
        where:{
            id: parseInt(id),
            published: true
        }
    });

    if(!post){
        res.status(404).json({message: 'Post not found'});
        return;
    }

    res.json(post);
}

// create a new post
export const createPost = async (req:Request, res:Response) => {
    const {title, content} = req.body;
    
    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }

    const post = await prismaClient.post.create({
        data:{
            title,
            content,
            autherId: payload.userId
        }
    });

    res.json(post);
}


// update post using post id
export const updatePost = async (req:Request, res:Response) => {
    const {id} = req.params;
    const {title, content} = req.body;

    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }
 

   try {
     const post = await prismaClient.post.update({
         where:{
             id: parseInt(id)
         },
         data:{
             title,
             content,
             updatedAt: new Date()
         }
     });
        res.json(post);
   } catch (error) {
         res.status(404).json({message: 'Post is not found'});
         return;
   }

}

// delete post using post id
export const deletePost = async (req:Request, res:Response) => {
    const {id} = req.params;

    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }

    try{
        const post = await prismaClient.post.delete({
            where:{
                id: parseInt(id)
            }
        });
        res.json({message: 'Post is deleted'});
    }catch (error) {  
        res.status(404).json({message: 'Post is not found'});
        return;
    }

    

    
}

// publish post using post id
export const publishPost = async (req:Request, res:Response) => {
    const {id} = req.params;

    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }

    


    try {
        const post = await prismaClient.post.update({
            where:{
                id: parseInt(id),
                autherId: payload.userId
            },
            data:{
                published: true
            }
        });
        res.json(post);
    } catch (error) {
        res.status(404).json({message: error});
        return;
    }
    
}

// get all posts by user
export const getAllPostsByUser = async (req:Request, res:Response) => {
    const payload = authenticate(req, res);

    if(!payload){
        res.status(401).json({message: 'User is not authenticated'});
        return;
    }

    const posts = await prismaClient.post.findMany({
        where:{
            autherId: payload.userId
        }
    });



    res.json(posts);
}