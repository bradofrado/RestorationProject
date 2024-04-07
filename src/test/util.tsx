import { render, type RenderOptions } from '@testing-library/react';
import React, { type ReactElement } from 'react';
import fs from 'fs';
import { type EventPage } from '~/utils/types/page';
import { type TimelineCategory, type TimelineItemStandalone } from '~/utils/types/timeline';

const wrapper = ({ children }: React.PropsWithChildren) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const view = render(ui, { wrapper, ...options });

  const style = document.createElement('style');
  style.innerHTML = fs.readFileSync('src/test/index.css', 'utf8');
  document.head.appendChild(style);

  return view;
};

export * from '@testing-library/react';
export { customRender as render };


const colors = {
	'Book of Mormon': '#F1635C',
	'Book of Mormon Translation': '#f1975c'
} as const;

export const categories: TimelineCategory[] = [
	{
		id: 1,
		name: "Book of Mormon",
		pageId: "0",
		color: colors["Book of Mormon"],
		items: [
			{
				id: 1,
				categoryId: 1,
				subcategory: null,
				date: new Date(1827, 8, 22),
				endDate: null,
				text: "Joseph obtains the plates with Emma from the hill.",
				links: ["https://www.josephsmithpapers.org/paper-summary/lucy-mack-smith-history-1845/112"],
				x: null,
				y: null
			},
			{
				id: 2,
				categoryId: 1,
				subcategory: null,
				date: new Date(1827, 10, 9),
				endDate: null,
				text: "Joseph and Emma move to Harmony, PA.",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-1838-1856-volume-a-1-23-december-1805-30-august-1834/10"],
				x: null,
				y: null
			},
			{
				id: 3,
				categoryId: 1,
				subcategory: null,
				date: new Date(1828, 0, 1),
				endDate: null,
				text: "Martin Harris comes to Palmyra and says that God told him in a vision to take some characters to New York (Charles Anthony).",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-circa-summer-1832/5"],
				x: null,
				y: null
			},
			{
				id: 4,
				categoryId: 1,
				subcategory: null,
				date: new Date(1828, 3, 12),
				endDate: new Date(1828, 5, 14),
				text: "When Martin Harris returns, he and Joseph earnestly translate 116 pages of the Book of Mormon.",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-1838-1856-volume-a-1-23-december-1805-30-august-1834/10"],
				x: null,
				y: null
			},
			{
				id: 5,
				categoryId: 1,
				subcategory: null,
				date: new Date(1828, 5, 1),
				endDate: null,
				text: "Martin Harris takes and loses the 116 pages of the Book of Lehi.",
				links: ["https://www.josephsmithpapers.org/paper-summary/revelation-book-1/3"],
				x: null,
				y: null
			},
			{
				id: 6,
				categoryId: 1,
				subcategory: null,
				date: new Date(1828, 6, 1),
				endDate: null,
				text: "Joseph rebuked and loses the plates and gift to translate.",
				links: ["https://catalog.churchofjesuschrist.org/assets?id=cbff7497-0764-4f7d-9aec-702b5f9b8f27&crate=0&index=0"],
				x: null,
				y: null
			},
			{
				id: 7,
				categoryId: 1,
				subcategory: null,
				date: new Date(1828, 8, 1),
				endDate: null,
				text: "Joseph gets the gold plates and interpreters again",
				links: ["https://www.josephsmithpapers.org/paper-summary/history-circa-summer-1832/6#source-note"],
				x: null,
				y: null
			},
			{
				id: 8,
				categoryId: 1,
				subcategory: null,
				date: new Date(1829, 3, 7),
				endDate: new Date(1829, 5, 1),
				text: "Oliver Cowdery arrives and begins acting as the primary translation scribe. The majority of the Book of Mormon is translated.",
				links: ["https://www.churchofjesuschrist.org/study/scriptures/pgp/js-h/1?lang=eng"],
				x: null,
				y: null
			}
		]
	},
	{
		id: 2,
		name: "Book of Mormon Translation",
		pageId: "1",
		color: colors["Book of Mormon Translation"],
		items: [
			{
				id: 9,
				categoryId: 2,
				date: new Date(1829, 7, 11),
				endDate: null,
				subcategory: "Seer stone in a hat",
				text: "\"The greatest piece of superstition that has ever come within the sphere of our knowledge is one which has for sometime past, and still occupies the attention of a few superstitious and bigoted individuals of this quarter. It is generally known and spoken of as the \"Golden Bible.\"…It was said that the leaves of the Bible were plates, of gold about eight inches long, six wide, and one eighth of an inch thick, on which were engraved characters or hieroglyphics. By placing the spectacles in a hat, and looking into it, Smith could (he said so, at least,) interpret these characters….\" -Jonathan Hadley",
				links: ["https://user.xmission.com/~research/central/palmyrafreeman.pdf"],
				x: null, 
				y: null
			},
			{
				id: 10,
				categoryId: 2,
				date: new Date(1879, 9, 1),
				endDate: null,
				subcategory: "Seer stone in a hat",
				text: "\"In writing for your father I frequently wrote day after day, often sitting at the table close by him, he sitting with his face buried in his hat, with the stone in it, and dictating hour after hour with nothing between us…\" -Emma Smith",
				links: ["https://archive.org/details/TheSaintsHerald_Volume_26_1879/page/n287/mode/2up?view=theater"],
				x: null, 
				y: null
			},
			{
				id: 11,
				categoryId: 2,
				date: new Date(1831, 1, 7),
				endDate: null,
				subcategory: "Seer stone in a hat",
				text: "\"The engraving being unintelligible to learned and unlearned. there is said to have been in the box with the plates two transparent stones in the form of spectacles thro which the translator looked on the engraving and afterwards put his face into a hat and the interpretation then flowed into his mind. which he uttered to the amanuensis who wrote it down\" -Christian Goodwillie",
				links: ["https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=1065&context=mormonhistory"],
				x: null, 
				y: null
			},
			{
				id: 12,
				categoryId: 2,
				date: new Date(1830, 11, 18),
				endDate: null,
				subcategory: "Two spectacles",
				text: "\"To Smith was given the power to translate the character, which he was enabled to do by looking through two semi transparent stones, but as he was ignorant of the art of writing, Cowdry and the others wrote as Smith, the person who was first directed to dig for the plates, interpreted.\" -The Philadelphia Album",
				links: ["https://contentdm.lib.byu.edu/digital/collection/BOMP/id/334"],
				x: null, 
				y: null
			},
			{
				id: 13,
				categoryId: 2,
				date: new Date(1859, 7, 1),
				endDate: null,
				subcategory: "Two spectacles",
				text: "\"The two stones set in a bow of silver were about two inches in diameter, perfectly round, and about five eighths of an inch thick at the centre; but not so thick at the edges where they came into the bow. They were joined by a round bar of silver, about three eighths of an inch in diameter, and about four inches long, which, with the two stones, would make eight inches.\" -Joel Tiffany",
				links: ["https://archive.org/details/threewitnesses/page/163/mode/2up"],
				x: null, 
				y: null
			}
		]
	}
]

export const itemsSorted = categories.reduce<TimelineItemStandalone[]>((prev, curr) => {
	const items: TimelineItemStandalone[] = curr.items.filter(item => !!item.date).map(item => ({...item, color: curr.color, pageId: curr.pageId, date: item.date || new Date()}));
	prev = prev.concat(items);

	return prev;
}, []).sort((a, b) => {
	if (a.date < b.date) {
		return -1;
	} else if (a.date > b.date) {
		return 1;
	}

	return 0;
})

export const pages: EventPage[] = [
  {
      id: "0",
      title: "This is a page",
      description: "This is a description",
      url: "this-is-url",
      settings: [
		  {
			id: 0,
			data: {
				content: "This is a page",
				properties: null
			},
			pageId: "0",
			component: "Header",
			order: 0,
		  },
		  {
			id: 1,
			data: {
				content: "This is a description",
				properties: null
			},
			pageId: "0",
			component: "Paragraph",
			order: 1,
		  },
          {
              id: 2,
              data: {
                  content: "This is a header",
                  properties: null
              },
              pageId: "0",
              component: "Header",
			  order: 2
          },
          {
              id: 3,
              data: {
                  content: "This is a paragraph",
                  properties: null
              },
              pageId: "0",
              component: "Paragraph",
			  order: 3
          },
      ]
  },
  {
	id: "1",
	title: "This is another page",
	description: "This is another description",
	url: "this-is-another-url",
	settings: [
		{
			id: 2,
			data: {
				content: "This is another page",
				properties: null
			},
			pageId: "0",
			component: "Header",
			order: 0,
		},
		{
			id: 3,
			data: {
				content: "This is another description",
				properties: null
			},
			pageId: "0",
			component: "Paragraph",
			order: 1,
		},
		{
			id: 4,
			data: {
				content: "This is another header",
				properties: null
			},
			pageId: "1",
			component: "Header",
			order: 2
		},
		{
			id: 5,
			data: {
				content: "This is another paragraph",
				properties: null
			},
			pageId: "1",
			component: "Paragraph",
			order: 3,
		},
		{
		    id: 6,
		    data: {
		        content: "Book of Mormon",
		        properties: null
		    },
		    pageId: "1",
		    component: "Timeline",
			order: 4,
		},
		{
		    id: 7,
		    data: {
		        content: "custom",
		        properties: "{\"margin\":0,\"color\":\"#D87D7DFF\",\"group\":true,\"items\":[\"Here\",\"are\",\"some\",\"List\",\"items\"]}"
		    },
		    pageId: "1",
		    component: "List",
			order: 5,
		},
		{
		    id: 8,
		    data: {
		        content: "Book of Mormon",
		        properties: null
		    },
		    pageId: "1",
		    component: "List",
			order: 6,
		},
		{
		    id: 9,
		    data: {
		        content: "Book of Mormon Translation",
		        properties: '{\"margin\":0,\"color\":\"#D87D7DFF\",\"group\":true,\"items\":[]}'
		    },
		    pageId: "1",
		    component: "List",
			order: 7
		},
	]
}
]