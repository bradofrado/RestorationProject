import { z } from 'zod';
import { HexColorSchema, type HexColor } from './colors';
import { TimelineDateType, type Prisma } from '@prisma/client';
import { type Replace } from '../utils';

const timelineCategories = [
  'Book of Mormon',
  'Book of Mormon Translation',
] as const;

export type TimelineCategoryName = string; //typeof timelineCategories[number];
export type TimelineSubcategory = 'Seer stone in a hat' | 'Two spectacles';
export const isTimelineCategory = (
  value: string
): value is TimelineCategoryName =>
  (timelineCategories as ReadonlyArray<string>).includes(value);

interface TimelineAttributes {
  pageId: string | null;
  color?: HexColor;
}

export const TimelineItemArgs = {} satisfies Prisma.TimelineItemDefaultArgs;
export type PrismaTimelineItem = Prisma.TimelineItemGetPayload<
  typeof TimelineItemArgs
>;

type PrismaTimelineItemWithLinksArray = Replace<
  PrismaTimelineItem,
  'links',
  string[]
>;
export const RestorationTimelineItemSchema = z.object({
  id: z.number(),
  date: z.date().nullable(),
  endDate: z.date().nullable(),
  subcategory: z.string().nullable(),
  text: z.string(),
  links: z.array(z.string()),
  categoryId: z.number().nullable(),
  type: z.nativeEnum(TimelineDateType),
}) satisfies z.Schema<Omit<PrismaTimelineItemWithLinksArray, 'isDeleted'>>;
export type RestorationTimelineItem = z.infer<
  typeof RestorationTimelineItemSchema
>;
export type TimelineItemStandalone = Omit<
  RestorationTimelineItem & TimelineAttributes,
  'date'
> & {
  date: Date;
};

export const TimelineCategoryArgs = {
  include: { items: TimelineItemArgs },
} satisfies Prisma.TimelineCategoryDefaultArgs;

export type PrismaTimelineCategory = Prisma.TimelineCategoryGetPayload<
  typeof TimelineCategoryArgs
>;

export const TimelineCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  pageId: z.string().nullable(),
  color: HexColorSchema,
  items: z.array(RestorationTimelineItemSchema),
}) satisfies z.Schema<
  Replace<
    Omit<PrismaTimelineCategory, 'isDeleted'>,
    'items',
    RestorationTimelineItem[]
  > &
    TimelineAttributes
>;

export type TimelineCategory = z.infer<typeof TimelineCategorySchema>;
