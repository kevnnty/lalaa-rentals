import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((value) => value === true, {
    message: "Please accept our terms and conditions",
  }),
});

export type RegisterForm = z.infer<typeof registerSchema>;
