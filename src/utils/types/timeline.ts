import { type HexColor } from "./colors";

const timelineCategories = ["Book of Mormon", "Book of Mormon Translation"] as const;

export type TimelineCategory = string//typeof timelineCategories[number];
export type TimelineSubcategory = "Seer stone in a hat" | "Two spectacles";
export const isTimelineCategory = (value: string): value is TimelineCategory => (timelineCategories as ReadonlyArray<string>).includes(value)

export interface RestorationTimelineItem {
	date: Date,
	endDate?: Date,
	category: TimelineCategory,
	subcategory?: TimelineSubcategory,
	text: string,
	links: string[],
	page: string,
	color?: HexColor
}