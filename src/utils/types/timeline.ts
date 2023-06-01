import { z } from "zod";
import { HexColorSchema, type HexColor } from "./colors";
import { type Prisma } from "@prisma/client";
import { type Replace } from "../utils";

const timelineCategories = ["Book of Mormon", "Book of Mormon Translation"] as const;

export type TimelineCategoryName = string//typeof timelineCategories[number];
export type TimelineSubcategory = "Seer stone in a hat" | "Two spectacles";
export const isTimelineCategory = (value: string): value is TimelineCategoryName => (timelineCategories as ReadonlyArray<string>).includes(value)

interface TimelineAttributes {
	page: string,
	color?: HexColor
}

export const TimelineItemArgs = {
	
} satisfies Prisma.TimelineItemArgs
export type PrismaTimelineItem = Prisma.TimelineItemGetPayload<typeof TimelineItemArgs>

type PrismaTimelineItemWithLinksArray = Replace<PrismaTimelineItem, "links", string[]>
export const RestorationTimelineItemSchema = z.object({
	id: z.number(),
	date: z.date(),
	endDate: z.date().nullable(),
	subcategory: z.string().nullable(),
	text: z.string(),
	links: z.array(z.string()),
	categoryId: z.number().nullable()
}) satisfies z.Schema<PrismaTimelineItemWithLinksArray>
export type RestorationTimelineItem = z.infer<typeof RestorationTimelineItemSchema>
export type TimelineItemStandalone =  RestorationTimelineItem & TimelineAttributes;

export const TimelineCategoryArgs = {
	include: {items: TimelineItemArgs}
} satisfies Prisma.TimelineCategoryArgs

export type PrismaTimelineCategory = Prisma.TimelineCategoryGetPayload<typeof TimelineCategoryArgs>;

export const TimelineCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	page: z.string(),
	color: HexColorSchema,
	items: z.array(RestorationTimelineItemSchema)
}) satisfies z.Schema<Replace<PrismaTimelineCategory, "items", RestorationTimelineItem[]> & TimelineAttributes>

export type TimelineCategory = z.infer<typeof TimelineCategorySchema>

