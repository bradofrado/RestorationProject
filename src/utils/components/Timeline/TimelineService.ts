import type { RestorationTimelineItem } from "./Timeline";

export class TimelineService {
	getItems(): RestorationTimelineItem[] {
		return [
			{
				date: new Date(1831, 0, 12),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is Janurary 12th, 1831",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1831, 1, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is Feburary 9th, 1831",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1831, 1, 29),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is Feburary 29th, 1831",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1831, 1, 1),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is Feburary 1th, 1831",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1832, 3, 15),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is April 15th, 1832",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1833, 10, 19),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is November 19th, 1833",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1833, 11, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is December 9th, 1833",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1840, 6, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is July 9th, 1840",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1845, 7, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is August 9th, 1845",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
			{
				date: new Date(1850, 10, 9),
				category: {
					color: "red",
					tag: "tag"
				},
				text: "This is November 9th, 1850",
				link: {
					url: "https://google.com",
					text: "google"
				},
			},
		]
	}
}