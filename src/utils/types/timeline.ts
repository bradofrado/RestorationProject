import { type HexColor } from "./colors";
import { type TimelinePageType } from "./page";

const timelineCategories = ["Book of Mormon", "Book of Mormon Translation"] as const;

export type TimelineCategory = typeof timelineCategories[number];
export type TimelineSubcategory = "Seer stone in a hat" | "Two spectacles";
export const isTimelineCategory = (value: string): value is TimelineCategory => (timelineCategories as ReadonlyArray<string>).includes(value)

export interface RestorationTimelineItem {
	date: Date,
	endDate?: Date,
	category: TimelineCategory,
	subcategory?: TimelineSubcategory,
	text: string,
	links: string[],
	page: TimelinePageType,
	color?: HexColor
}