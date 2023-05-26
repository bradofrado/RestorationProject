import { Prisma } from "@prisma/client"
import { isComponentType, isEditableData } from "../components/AddComponent"

// export interface ComponentSettings {
// 	component: ComponentType,
// 	data: EditableData | null
// }

const data = Prisma.validator<Prisma.EditableDataArgs>()({
	select: { content: true, properties: true}
})

const settingsWithData = Prisma.validator<Prisma.ComponentSettingsArgs>()({
	include: {data: data}
})

const pageWithSettings = Prisma.validator<Prisma.PageArgs>()({
	include: { settings: settingsWithData}
})

export type ComponentSettings = Prisma.ComponentSettingsGetPayload<typeof settingsWithData>
export type EventPage = Prisma.PageGetPayload<typeof pageWithSettings>
export type EditableData = Prisma.EditableDataGetPayload<typeof data>

const isComponentSettings = (val: object): val is ComponentSettings => {
	if (!('component' in val && 'data' in val)) {
		return false;
	}

	if (!(typeof val.component == 'string') || !isComponentType(val.component)) {
		return false;
	}

	if (val.data == null) {
		return true;
	}

	if (typeof val.data == 'object' && !isEditableData(val.data)) {
		return false;
	}

	return true;
}

export const isEventPage = (val: object): val is EventPage => {
	if (!('title' in val && 'description' in val && 'settings' in val)) {
		return false;
	}

	if (!Array.isArray(val.settings)) {
		return false;
	}

	if (!val.settings.every(v => typeof v == 'object' && isComponentSettings(v as object))) {
		return false;
	}

	return true;
}

const timelinePages = ['book-of-mormon'] as const;

export type TimelinePageType = typeof timelinePages[number];
export const isTimelinePage = (page: string): page is TimelinePageType => (timelinePages as ReadonlyArray<string>).includes(page)