import { type ComponentType, type EditableData } from "../components/AddComponent"

export interface ComponentSettings {
	component: ComponentType,
	data: EditableData | null
}

export interface EventPage {
	title: string,
	description: string,
	settings: ComponentSettings[]
} 

const timelinePages = ['book-of-mormon'] as const;

export type TimelinePageType = typeof timelinePages[number];
export const isTimelinePage = (page: string): page is TimelinePageType => timelinePages.includes(page)