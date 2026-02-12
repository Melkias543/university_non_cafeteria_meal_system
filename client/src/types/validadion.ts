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
    errorMap: () => ({ message: "Status must be pending, active, or inactive" }),
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

// export interface MenuItem {
//   id: number;
//   name: string;
//   description?: string;
//   price: number;
//   category: string;
//   image?: string;
//   is_available: boolean;
// }

export const menuItemSchema = zod.object({
    id: zod.number().optional(),  // optional because new items don’t have an ID yet
  name: zod.string().min(1, "Item name is required"),
  description: zod.string().optional(),
  price: zod.number().min(0, "Price must be a positive number"),
    image: zod.any().optional(), // ✅ SIMPLE
  is_available: zod.boolean(),
});

export type MenuItemInput = zod.infer<typeof menuItemSchema>;


/* =========================
   USER SCHEMA
========================= */


export const userSchema = zod.object({
  id: zod.string().uuid().optional(),

  full_name: zod.string().min(1, "Full name is required"),

  email: zod.string().email("Invalid email address"),

status: zod.enum(["pending", "active", "approved", "rejected"]).default("pending"),

  password: zod.string().min(6, "Password must be at least 6 characters"),

  user_id: zod.string().uuid("Invalid user ID"),

  photo_url: zod.string().url("Invalid photo URL").optional().nullable(),

  phone: zod.string().optional().nullable(),

  department: zod.string().optional().nullable(),

  profile: zod
    .object({
      id: zod.string().uuid(),
      user_id: zod.string().uuid(),
      phone: zod.string().optional().nullable(),
      department: zod.string().optional().nullable(),
      photo_url: zod.string().url().optional().nullable(),
      created_at: zod.string(),
      updated_at: zod.string(),
    })
    .optional()
    .nullable(),

  wallet: zod
    .object({
      id: zod.string().uuid(),
      user_id: zod.string().uuid(),
      balance: zod.number().default(0),
      created_at: zod.string(),
      updated_at: zod.string(),
    })
    .optional()
    .nullable(),
});

export type userType = zod.infer<typeof userSchema>;
