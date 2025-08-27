import { z } from 'zod';
import { type User as UserDB } from '@prisma/client';

const roles = ['admin', 'user', 'edit'] as const;
export type UserRole = (typeof roles)[number];
export const userRoleSchema = z.custom<UserRole>((val: unknown) => {
  return (
    typeof val == 'string' && (roles as ReadonlyArray<string>).includes(val)
  );
});

export const signupSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
}) satisfies z.Schema<Pick<UserDB, 'email' | 'password' | 'name'>>;
export type Signup = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}) satisfies z.Schema<Pick<UserDB, 'email' | 'password'>>;
export type Login = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  email: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
  id: z.string(),
  role: userRoleSchema,
}) satisfies z.Schema<
  Pick<UserDB, 'email' | 'name' | 'id'> & {
    role: UserRole;
    image?: string | null;
  }
>;
export type User = z.infer<typeof userSchema>;
