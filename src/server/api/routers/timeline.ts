import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type RestorationTimelineItem, type TimelineCategoryName, isTimelineCategory, type TimelineCategory, TimelineCategorySchema } from "~/utils/types/timeline";
import { z } from "zod";

const getCategory = (categoryName: TimelineCategoryName) => {
	const category = categories.find(x => x.name == categoryName);
	if (category == undefined) {
		throw new TRPCError({code: "BAD_REQUEST", message: `Invalid cateogry name ${categoryName}`})
	}

	return category;
}

export const timelineRouter = createTRPCRouter({
	getItems: publicProcedure
		.input((val: unknown) => {
			if (val === undefined) {
				return val;
			}

			if (typeof val == 'string' && isTimelineCategory(val)) {
				return val;
			}

			throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: `Invalid item ${typeof val}`});
		})
		.query(({input}) => {
			if (input) {
				const category = getCategory(input);
				return category.items;
			} else {
				const items = categories.reduce<RestorationTimelineItem[]>((prev, curr) => {
					prev = prev.concat(curr.items);

					return prev;
				}, []);
				return items;
			}
		}),
	getCategory: publicProcedure
		.input(z.string())
		.query(({input}) => {
			return getCategory(input);
		}),
	getCategories: publicProcedure
		.query(() => {
			return categories;
		}),
	createCategory: publicProcedure
		.input(TimelineCategorySchema)
		.mutation(({input}) => {
			categories.push(input as TimelineCategory);
		}),
	updateCategory: publicProcedure
		.input(TimelineCategorySchema)
		.mutation(({input}) => {
			const index = categories.findIndex(x => x.name = input.name);
			if (index < 0) {
				throw new TRPCError({code: "BAD_REQUEST", message: `Invalid category ${input.name}`})
			}
			categories[index] = input as TimelineCategory;
		}),
	deleteCategory: publicProcedure
		.input(z.string())
		.mutation(({input}) => {
			const index = categories.findIndex(x => x.name = input);
			if (index < 0) {
				throw new TRPCError({code: "BAD_REQUEST", message: `Invalid category ${input}`})
			}
			categories.splice(index, 1); 
		}),
	// createTimeline: publicProcedure
	// 	.input(RestorationTimelineItemSchema)
	// 	.mutation(({input}) => {

	// 	}),
	// updateTimeline: publicProcedure
	// 	.input(RestorationTimelineItemSchema)
	// 	.mutation(({input}) => {

	// 	})
})

const colors = {
	'Book of Mormon': '#F1635C',
	'Book of Mormon Translation': '#f1975c'
} as const;

const categories: TimelineCategory[] = [
	{
		name: "Book of Mormon",
		page: "book-of-mormon",
		color: colors["Book of Mormon"],
		items: [
			{
				date: new Date(1827, 8, 22),
				text: "Joseph obtains the plates with Emma from the hill.",
				links: ["https://www.josephsmithpapers.org/paper-summary/lucy-mack-smith-history-1845/112"],
			},
			{
				date: new Date(1827, 10, 9),
				text: "Joseph and Emma move to Harmony, PA.",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-1838-1856-volume-a-1-23-december-1805-30-august-1834/10"],
			},
			{
				date: new Date(1828, 0, 1),
				text: "Martin Harris comes to Palmyra and says that God told him in a vision to take some characters to New York (Charles Anthony).",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-circa-summer-1832/5"],
			},
			{
				date: new Date(1828, 3, 12),
				endDate: new Date(1828, 5, 14),
				text: "When Martin Harris returns, he and Joseph earnestly translate 116 pages of the Book of Mormon.",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-1838-1856-volume-a-1-23-december-1805-30-august-1834/10"],
			},
			{
				date: new Date(1828, 5, 1),
				text: "Martin Harris takes and loses the 116 pages of the Book of Lehi.",
				links: ["https://www.josephsmithpapers.org/paper-summary/revelation-book-1/3"],
			},
			{
				date: new Date(1828, 6, 1),
				text: "Joseph rebuked and loses the plates and gift to translate.",
				links: ["https://catalog.churchofjesuschrist.org/assets?id=cbff7497-0764-4f7d-9aec-702b5f9b8f27&crate=0&index=0"],
			},
			{
				date: new Date(1828, 8, 1),
				text: "Joseph gets the gold plates and interpreters again",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-circa-summer-1832/6#source-note"],
			},
			{
				date: new Date(1829, 3, 7),
				endDate: new Date(1829, 5, 1),
				text: "Oliver Cowdery arrives and begins acting as the primary translation scribe. The majority of the Book of Mormon is translated.",
				links: ["https://www.churchofjesuschrist.org/study/scriptures/pgp/js-h/1?lang=eng"],
			}
		]
	},
	{
		name: "Book of Mormon Translation",
		page: "book-of-mormon",
		color: colors["Book of Mormon Translation"],
		items: [
			{
				date: new Date(1829, 7, 11),
				subcategory: "Seer stone in a hat",
				text: "\"The greatest piece of superstition that has ever come within the sphere of our knowledge is one which has for sometime past, and still occupies the attention of a few superstitious and bigoted individuals of this quarter. It is generally known and spoken of as the \"Golden Bible.\"…It was said that the leaves of the Bible were plates, of gold about eight inches long, six wide, and one eighth of an inch thick, on which were engraved characters or hieroglyphics. By placing the spectacles in a hat, and looking into it, Smith could (he said so, at least,) interpret these characters….\" -Jonathan Hadley",
				links: ["https://user.xmission.com/~research/central/palmyrafreeman.pdf"],
			},
			{
				date: new Date(1879, 9, 1),
				subcategory: "Seer stone in a hat",
				text: "\"In writing for your father I frequently wrote day after day, often sitting at the table close by him, he sitting with his face buried in his hat, with the stone in it, and dictating hour after hour with nothing between us…\" -Emma Smith",
				links: ["https://archive.org/details/TheSaintsHerald_Volume_26_1879/page/n287/mode/2up?view=theater"],
			},
			{
				date: new Date(1831, 1, 7),
				subcategory: "Seer stone in a hat",
				text: "\"The engraving being unintelligible to learned & unlearned. there is said to have been in the box with the plates two transparent stones in the form of spectacles thro which the translator looked on the engraving & afterwards put his face into a hat & the interpretation then flowed into his mind. which he uttered to the amanuensis who wrote it down\" -Christian Goodwillie",
				links: ["https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=1065&context=mormonhistory"],
			},
			{
				date: new Date(1830, 11, 18),
				subcategory: "Two spectacles",
				text: "\"To Smith was given the power to translate the character, which he was enabled to do by looking through two semi transparent stones, but as he was ignorant of the art of writing, Cowdry and the others wrote as Smith, the person who was first directed to dig for the plates, interpreted.\" -The Philadelphia Album",
				links: ["https://contentdm.lib.byu.edu/digital/collection/BOMP/id/334"],
			},
			{
				date: new Date(1859, 7, 1),
				subcategory: "Two spectacles",
				text: "\"The two stones set in a bow of silver were about two inches in diameter, perfectly round, and about five eighths of an inch thick at the centre; but not so thick at the edges where they came into the bow. They were joined by a round bar of silver, about three eighths of an inch in diameter, and about four inches long, which, with the two stones, would make eight inches.\" -Joel Tiffany",
				links: ["https://archive.org/details/threewitnesses/page/163/mode/2up"],
			}
		]
	}
]