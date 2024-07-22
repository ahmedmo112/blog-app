import e, { Router } from "express";
import { createPost, deletePost, getAllPosts, getAllPostsByUser, getPost, publishPost, updatePost } from "../services/blog";


const blogRouter: Router = Router();

blogRouter.get('/posts', getAllPosts);

blogRouter.get('/post/:id', getPost);

blogRouter.post('/post', createPost);

blogRouter.put('/post/:id', updatePost);

blogRouter.delete('/post/:id', deletePost);

blogRouter.put('/post/publish/:id', publishPost);

blogRouter.get('/myposts', getAllPostsByUser);


export default blogRouter;