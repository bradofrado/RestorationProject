import type { RestorationTimelineItem } from "./Timeline";

export class TimelineService {
	getItems(): RestorationTimelineItem[] {
		return [
			{
				date: new Date(1827, 10, 12),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Joseph restrieves plates from the hill",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1827, 11, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Joseph and Emaa move to Harmony PA",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1828, 1, 28),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Book of lehi is translated",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1828, 2, 1),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Martin Harris takes translated characters to N.Y",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1828, 7, 15),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Martin Harris takes and loses the 116 pages of the Book of Lehi",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1828, 8, 19),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Joseph rebuked and loses the plates and gift to translate",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1828, 10, 1),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Plates and interpreters have been returned to Joseph",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1828, 10, 30),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Sporadic translation with various scribes",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1829, 5, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Oliver Cowdery arrives and begins acting as the primary translation scribe",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1829, 7, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "Majority of Book of Mormon is translated",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
		]
	}
}