export class TimelineService {
	getItems(category?: TimelineCategory): RestorationTimelineItem[] {
		if (category) {
			return items.filter(x => x.category === category);
		}

		return items;
	}
}

export type TimelineCategory = "Book of Mormon" | "Book of Mormon Translation";
export type TimelineSubcategory = "Seer stone in a hat" | "Two spectacles";

export interface RestorationTimelineItem {
	date: Date,
	category: TimelineCategory,
	subcategory?: TimelineSubcategory,
	text: string,
	links: string[],
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
	{
		date: new Date(1829, 7, 11),
		category: "Book of Mormon Translation",
		subcategory: "Seer stone in a hat",
		text: "\"The greatest piece of superstition that has ever come within the sphere of our knowledge is one which has for sometime past, and still occupies the attention of a few superstitious and bigoted individuals of this quarter. It is generally known and spoken of as the \"Golden Bible.\"…It was said that the leaves of the Bible were plates, of gold about eight inches long, six wide, and one eighth of an inch thick, on which were engraved characters or hieroglyphics. By placing the spectacles in a hat, and looking into it, Smith could (he said so, at least,) interpret these characters….\" -Jonathan Hadley",
		links: ["https://user.xmission.com/~research/central/palmyrafreeman.pdf"],
	},
	{
		date: new Date(1879, 9, 1),
		category: "Book of Mormon Translation",
		subcategory: "Seer stone in a hat",
		text: "\"In writing for your father I frequently wrote day after day, often sitting at the table close by him, he sitting with his face buried in his hat, with the stone in it, and dictating hour after hour with nothing between us…\" -Emma Smith",
		links: ["https://archive.org/details/TheSaintsHerald_Volume_26_1879/page/n287/mode/2up?view=theater"]
	},
	{
		date: new Date(1831, 1, 7),
		category: "Book of Mormon Translation",
		subcategory: "Seer stone in a hat",
		text: "\"The engraving being unintelligible to learned & unlearned. there is said to have been in the box with the plates two transparent stones in the form of spectacles thro which the translator looked on the engraving & afterwards put his face into a hat & the interpretation then flowed into his mind. which he uttered to the amanuensis who wrote it down\" -Christian Goodwillie",
		links: ["https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=1065&context=mormonhistory"]
	}
]