import { EventPage, TimelinePageType } from "~/utils/types/page";
import { ComponentType, EditableData } from "../AddComponent";
import { TimelineService, type RestorationTimelineItem, type TimelineCategory } from "../Timeline/TimelineService";
import BookOfMormonTranslationMethods from "./book-of-mormon-translation";
import { api } from "~/utils/api";

class EventPageService {
	private timelineService: TimelineService;

	constructor() {
		this.timelineService = new TimelineService();
	}
	getPage(id: TimelinePageType): EventPage | undefined {
		const query = api.page.getPage.useQuery(id);
		const data = query.data;
		
		return data;
	}
}

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export type EventPageComponent = React.FC<{
	linkCount: number
}>

export default EventPageService;