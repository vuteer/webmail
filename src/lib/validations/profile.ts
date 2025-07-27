// lib/validations/profile.ts
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// Avatar validation
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const avatarSchema = z
  .instanceof(File)
  .optional()
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    "Max image size is 2MB.",
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .png, and .webp formats are supported.",
  );

// Profile schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  avatarFile: avatarSchema,
  phone: z
    .string()
    .refine((val) => isValidPhoneNumber(val), "Invalid phone number")
    .optional(),
});

// Password schema
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// 2FA schema
export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must be numeric"),
  method: z.enum(["sms", "authenticator"]),
});
