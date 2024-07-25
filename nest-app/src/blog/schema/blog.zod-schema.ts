import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
});

export type UpdatePostDto = z.infer<typeof updatePostSchema>;
