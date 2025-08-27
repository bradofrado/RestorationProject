import {
  type User,
  type Signup,
  type Login,
  userRoleSchema,
} from '~/utils/types/auth';
import { type User as UserDB } from '@prisma/client';
import argon from 'argon2';
import { TRPCError } from '@trpc/server';
import { type Db } from '~/server/db';

export const dbToUser = (user: UserDB): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: userRoleSchema.parse(user.role),
  };
};

type SignupProps = {
  input: Signup;
  db: Db;
};
export const signup = async ({ input, db }: SignupProps) => {
  const { name, password } = input;
  const email = input.email.toLowerCase();

  const exists = await db.user.findFirst({
    where: { email },
  });

  if (exists) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'User already exists.',
    });
  }

  const hashedPassword = await argon.hash(password);

  const user = await db.user.create({
    data: { email, password: hashedPassword, name },
  });

  await db.account.create({
    data: {
      userId: user.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: user.id,
    },
  });

  return dbToUser(user);
};

type LoginProps = {
  input: Login;
  db: Db;
};
export const login = async ({
  input,
  db,
}: LoginProps): Promise<User | null> => {
  const user = await db.user.findFirst({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const isValidPassword = await argon.verify(user.password, input.password);
  if (!isValidPassword) {
    return null;
  }

  return dbToUser(user);
};
