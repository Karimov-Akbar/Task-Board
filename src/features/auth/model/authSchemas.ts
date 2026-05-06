import { z } from "zod";

export const loginSchema = z.object({
    nickname: z
        .string()
        .min(3, 'Минимум 3 символа')
        .max(24, 'Максимум 24 символа')
        .regex(/^[a-z0-9_]+$/, 'Только строчные буквы, цифры и _'), 
    password: z
        .string()
        .min(8, 'Минимум 8 символов'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
    email: z
        .string()
        .email('Неккоректный email')
        .optional()
        .or(z.literal('')),
});

export type RegisterFormData = z.infer<typeof registerSchema>;