import { Router } from "express";
import { createPost, deletePost, getAllPosts, getAllPostsByUser, getPost, publishPost, updatePost } from "../services/blog";
import { validateData } from "../middleware/validationMiddleware";
import { createPostSchema, idSchema, updatePostSchema } from "../schemas/blogSchemas";
import { authenticate } from "../middleware/authenticate";


const blogRouter: Router = Router();

blogRouter.get('/posts', getAllPosts);

blogRouter.get('/post/:id', validateData(idSchema, true), getPost);

blogRouter.post('/post', authenticate, validateData(createPostSchema), createPost);

blogRouter.put('/post/:id',authenticate, validateData(idSchema,true), validateData(updatePostSchema), updatePost);

blogRouter.delete('/post/:id',authenticate, validateData(idSchema,true), deletePost);

blogRouter.put('/post/publish/:id',authenticate, validateData(idSchema,true), publishPost);

blogRouter.get('/myposts',authenticate, getAllPostsByUser);


export default blogRouter;