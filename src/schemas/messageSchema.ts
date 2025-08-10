import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be atleast 10 character" })
    .max(300, { message: "content be must be no longer than 300 characters" }),
});
