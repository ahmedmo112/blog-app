import {z} from 'zod';

export const userSignupSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6)
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});