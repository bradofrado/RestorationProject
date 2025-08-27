import { type Prisma } from '@prisma/client';
import { z } from 'zod';
import { ComponentTypeSchema } from '../components/edit/add-component';
import { type Replace } from '../utils';

const data = {
  select: { content: true, properties: true },
} satisfies Prisma.EditableDataDefaultArgs;

const settingsWithData = {
  include: { data: data },
} satisfies Prisma.ComponentSettingsDefaultArgs;

const pageWithSettings = {
  include: { settings: settingsWithData },
} satisfies Prisma.PageDefaultArgs;

export const EditableDataSchema = z.object({
  content: z.string(),
  properties: z.string().nullable(),
}) satisfies z.Schema<Prisma.EditableDataGetPayload<typeof data>>;
export type EditableData = z.infer<typeof EditableDataSchema>;

export type PrismaComponentSettings = Prisma.ComponentSettingsGetPayload<
  typeof settingsWithData
>;
export const ComponentSettingsSchema = z.object({
  id: z.number(),
  pageId: z.string(),
  component: ComponentTypeSchema,
  data: EditableDataSchema,
  order: z.number(),
}) satisfies z.Schema<Omit<PrismaComponentSettings, 'isDeleted'>>;
export type ComponentSettings = z.infer<typeof ComponentSettingsSchema>;

export type PrismaPage = Prisma.PageGetPayload<typeof pageWithSettings>;
export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  settings: z.array(ComponentSettingsSchema),
  url: z.string(),
}) satisfies z.Schema<
  Replace<Omit<PrismaPage, 'isDeleted'>, 'settings', ComponentSettings[]>
>;
export type EventPage = z.infer<typeof PageSchema>;
