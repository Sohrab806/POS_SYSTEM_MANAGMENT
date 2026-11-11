import z from "zod";
 export const signupSchema = z.object({
  name: z.string().min(2),
  
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(6)
});

export type Signupbody= z.infer<typeof signupSchema>

 export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(6)
});

export type SigninBody=z.infer<typeof loginSchema>