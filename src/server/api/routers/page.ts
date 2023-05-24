import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { isTimelinePage, type EventPage, type TimelinePageType } from "~/utils/types/page";

const validateTimelinePageType = (val: unknown) => {
	if (typeof val === 'string' && isTimelinePage(val)) {
		return val;
	}

	throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: `Invalid input: ${typeof val}`});
}

export const pageRouter = createTRPCRouter({
	getPage: publicProcedure
		.input(validateTimelinePageType)
		.query((opts) => {
			const { input } = opts;
			return eventPages[input];
		})
});

const eventPages: {[key in TimelinePageType]: EventPage} = {
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
