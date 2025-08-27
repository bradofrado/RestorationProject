import { z } from 'zod';
import {
  type LoggingType as LoggingTypePrisma,
  type Prisma,
} from '@prisma/client';
import { type User, userSchema } from './auth';
import { type ReplaceWithName } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- ok
const loggingArgs = {
  include: { user: true },
};

export const logTypeSchema = z.enum([
  'WARN',
  'ERROR',
  'INFO',
]) satisfies z.Schema<LoggingTypePrisma>;
export type LoggingType = z.infer<typeof logTypeSchema>;

export const logSchema = z.object({
  user: userSchema.nullable(),
  date: z.date(),
  id: z.number(),
  type: logTypeSchema,
  message: z.string(),
}) satisfies z.Schema<
  ReplaceWithName<
    Omit<Prisma.LoggingGetPayload<typeof loggingArgs>, 'userId'>,
    'user',
    { user: User | null }
  >
>;
export type Log = z.infer<typeof logSchema>;
