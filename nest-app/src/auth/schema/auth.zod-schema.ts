import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDto = z.infer<typeof userLoginSchema>;
