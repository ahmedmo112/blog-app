import { prismaClient } from "..";
import { Request, Response } from "express";
import { Errors } from "../config/errors";

// retrive all posts
export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await prismaClient.post.findMany({
    where: {
      published: true,
    },
  });

  res.json(posts);
};

// retrive single post by id
export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await prismaClient.post.findUnique({
    where: {
      id: parseInt(id),
      published: true,
    },
  });

  if (!post) {
    res.status(404).json({ message: Errors.NotFound });
    return;
  }

  res.json(post);
};

// create a new post
export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const post = await prismaClient.post.create({
    data: {
      title,
      content,
      autherId: req.userId,
    },
  });

  res.json(post);
};

// update post using post id
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await prismaClient.post.update({
      where: {
        id: parseInt(id),
        autherId: req.userId,
      },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });
    res.json(post);
  } catch (error) {
    res.status(404).json({ message: Errors.NotFound });
    return;
  }
};

// delete post using post id
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prismaClient.post.delete({
      where: {
        id: parseInt(id),
        autherId: req.userId,
      },
    });
    res.json({ message: Errors.DeletedSuccessfully });
  } catch (error) {
    res.status(404).json({ message: Errors.NotFound });
    return;
  }
};

// publish post using post id
export const publishPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await prismaClient.post.update({
      where: {
        id: parseInt(id),
        autherId: req.userId,
      },
      data: {
        published: true,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(404).json({ message: error });
    return;
  }
};

// get all posts by user
export const getAllPostsByUser = async (req: Request, res: Response) => {
  const posts = await prismaClient.post.findMany({
    where: {
      autherId: req.userId,
    },
  });

  res.json(posts);
};
