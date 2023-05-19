import { ComponentType, EditableData } from "../AddComponent";
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
		settings: [
			{
				component: 'Header',
				data: {content: 'Timeline of Events'}
			},
			{
				component: 'Timeline',
				data: {content: 'Book of Mormon'}
			},
			{
				component: 'Header',
				data: {content: 'Translation Methods'}
			},
			{
				component: 'Paragraph',
				data: {content: `There are many accounts of the method of translation for the Book of Mormon. Some agree, and some disagree. When considering all of the accounts, scholars consider it best to view them with a "this and that" approach as opposed to a "either this or that" approach. The reason for this is that the contempory accounts of the translation process suggest that Joseph used a variety of methods of translation instead of just one. Not one of these accounts was there for the full translation process-- only Joseph Smith himself who did not give any details to the methods.`}
			},
			{
				component: 'List',
				data: {content: 'Book of Mormon Translation', properties: 'Group'}
			},
			{
				component: 'Header',
				data: {content: 'Other Sources'}
			},
			{
				component: 'Paragraph',
				data: {content: `Here are a few other insights to scholars and other professionals that give insights to the Book of Mormon and the methods of translation.`}
			},
			{
				component: 'List',
				data: {content: 'custom', properties: 'Book of Mormon Translation, Gospel Topics Essay from churchofjesuschrist.org|The Translation Miracle of the Book of Mormon by Elder Robert K. Dellenbach|The Credibility of the Book of Mormon Translators by Richard L. Anderson|The Book of Mormon: Historical Setting for Its Translation and Publication by Larry C. Porter'}
			}
		]
	}
}

export type TimelinePages = "book-of-mormon";

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export interface ComponentSettings {
	component: ComponentType,
	data: EditableData | null
}

export interface EventPage {
	title: string,
	description: string,
	settings: ComponentSettings[]
} 

export type EventPageComponent = React.FC<{
	linkCount: number
}>

export default EventPageService;