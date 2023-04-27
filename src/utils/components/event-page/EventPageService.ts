import { TimelineService, type RestorationTimelineItem, type TimelineCategory } from "../Timeline/TimelineService";
import BookOfMormonTranslationMethods from "./book-of-mormon-translation";

class EventPageService {
	private timelineService: TimelineService;

	constructor() {
		this.timelineService = new TimelineService();
	}
	getPage(id: TimelinePages): EventPage {
		return eventPages[id];
	}
}

const eventPages: {[key in TimelinePages]: EventPage} = {
	"book-of-mormon": {
		title: "Book of Mormon Translation",
		description: `The translation of the Book of Mormon can be considered the most pivotal question regarding the truthfulness of the restoration. 
		Joseph Smith was the only person that was present during the whole translation process, and all he said was that it was by &#34;the gift and power of God.&#34;`,
		timelineItems: "Book of Mormon",
		Component: BookOfMormonTranslationMethods
	}
}

export type TimelinePages = "book-of-mormon";

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export interface EventPage {
	title: string,
	description: string,
	timelineItems: TimelineCategory,
	Component: EventPageComponent
} 

export type EventPageComponent = React.FC<{
	linkCount: number
}>

export default EventPageService;