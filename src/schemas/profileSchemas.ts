import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().min(3).max(255),
});
