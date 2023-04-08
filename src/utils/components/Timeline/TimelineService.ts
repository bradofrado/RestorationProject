import type { RestorationTimelineItem, TimelineCategory } from "./Timeline";

export class TimelineService {
	getItems(category?: TimelineCategory): RestorationTimelineItem[] {
		if (category) {
			return items.filter(x => x.category === category);
		}

		return items;
	}
}

const items: RestorationTimelineItem[] = [
	{
		date: new Date(1827, 10, 12),
		category: "Book of Mormon",
		text: "Joseph restrieves plates from the hill",
		links: ["https://www.josephsmithpapers.org/paper-summary/lucy-mack-smith-history-1845/112",
		"https://www.josephsmithpapers.org/paper-summary/history-1838-1856-volume-a-1-23-december-1805-30-august-1834/10"],
	},
	{
		date: new Date(1827, 11, 9),
		category: "Book of Mormon",
		text: "Joseph and Emaa move to Harmony PA",
		links: ["https://www.josephsmithpapers.org/paper-summary/history-1838-1856-volume-a-1-23-december-1805-30-august-1834/10"],
	},
	{
		date: new Date(1828, 1, 28),
		category: "Book of Mormon",
		text: "Book of lehi is translated",
		links: [],
	},
	{
		date: new Date(1828, 2, 1),
		category: "Book of Mormon",
		text: "Martin Harris takes translated characters to N.Y",
		links: [],
	},
	{
		date: new Date(1828, 7, 15),
		category: "Book of Mormon",
		text: "Martin Harris takes and loses the 116 pages of the Book of Lehi",
		links: [],
	},
	{
		date: new Date(1828, 8, 19),
		category: "Book of Mormon",
		text: "Joseph rebuked and loses the plates and gift to translate",
		links: [],
	},
	{
		date: new Date(1828, 10, 1),
		category: "Book of Mormon",
		text: "Plates and interpreters have been returned to Joseph",
		links: [],
	},
	{
		date: new Date(1828, 10, 30),
		category: "Book of Mormon",
		text: "Sporadic translation with various scribes",
		links: [],
	},
	{
		date: new Date(1829, 5, 9),
		category: "Book of Mormon",
		text: "Oliver Cowdery arrives and begins acting as the primary translation scribe",
		links: [],
	},
	{
		date: new Date(1829, 7, 9),
		category: "Book of Mormon",
		text: "Majority of Book of Mormon is translated",
		links: [],
	},
]