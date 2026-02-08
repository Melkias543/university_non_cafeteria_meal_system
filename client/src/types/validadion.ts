import * as zod from "zod";

export const registerSchema = zod.object({
  full_name: zod
    .string()
    .min(2, "Full name must be at least 2 characters")
    .trim(), // Removes accidental whitespace
  email: zod
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(), // Normalizes email
  // status: zod.enum(['pending', 'active', 'inactive'], { 
  //   errorMap: () => ({ message: "Please select a valid status" }) 
  // }),
  status: zod.enum(["pending", "active", "inactive"], {
  message: "Status must be pending, active, or inactive",
}),

  password: zod
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
  password_confirmation: zod.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["confirm_password"], // This ensures the error shows up on the second password field
});

export type RegisterInput = zod.infer<typeof registerSchema>;


export const loginSchema = zod.object({
  email: zod.string().email("Invalid email format"),
  password: zod.string().min(1, "Password is required"),
});


export type LoginInput = zod.infer<typeof loginSchema>;