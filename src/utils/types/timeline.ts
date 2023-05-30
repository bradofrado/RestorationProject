import { z } from "zod";
import { HexColorSchema, type HexColor } from "./colors";

const timelineCategories = ["Book of Mormon", "Book of Mormon Translation"] as const;

export type TimelineCategoryName = string//typeof timelineCategories[number];
export type TimelineSubcategory = "Seer stone in a hat" | "Two spectacles";
export const isTimelineCategory = (value: string): value is TimelineCategoryName => (timelineCategories as ReadonlyArray<string>).includes(value)

interface TimelineAttributes {
	page: string,
	color?: HexColor
}

export interface RestorationTimelineItem {
	date: Date,
	endDate?: Date,
	subcategory?: string,
	text: string,
	links: string[],
}
export type TimelineItemStandalone =  RestorationTimelineItem & TimelineAttributes;

export const RestorationTimelineItemSchema = z.object({
	date: z.date(),
	endDate: z.date().optional(),
	subcategory: z.string().optional(),
	text: z.string(),
	links: z.array(z.string())
})

export interface TimelineCategory extends TimelineAttributes {
	name: TimelineCategoryName,
	items: RestorationTimelineItem[]
}

export const TimelineCategorySchema = z.object({
	name: z.string(),
	page: z.string(),
	color: HexColorSchema.optional(),
	items: z.array(RestorationTimelineItemSchema)
})