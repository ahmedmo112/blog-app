import { title } from "process";
import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().positive(),
});

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
})

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
});
