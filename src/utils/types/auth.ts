import {z} from 'zod';
import {User as UserDB} from '@prisma/client'

export const signupSchema = z.object({
    name: z.string(),
    password: z.string(),
    email: z.string().email()
}) satisfies z.Schema<Pick<UserDB, 'email' | 'password' | 'name'>>
export type Signup = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
}) satisfies z.Schema<Pick<UserDB, 'email' | 'password'>>;
export type Login = z.infer<typeof loginSchema>;

export type User = Pick<UserDB, 'email' | 'name' | 'image' | 'id'>