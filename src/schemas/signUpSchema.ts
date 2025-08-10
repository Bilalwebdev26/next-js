import { z } from "zod";
export const usernameValidation = z
  .string()
  .min(4, "Username must be atleast 4 character")
  .max(20, "Username must be no more than atleast 4 character")
  .regex(/^[A-Za-z0-9_]+$/, "Username must not contain special character");
  
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email address" }),
  password: z.string().min(6, {message:"Password must be at least 6 character long"}),
});
