import { api } from "~/utils/api";
import { type RestorationTimelineItem } from "../types/timeline";

export const useGetPages = () => {
	return api.page.getPages.useQuery();
}

export const useGetPage = (eventId: string) => {
	return api.page.getPage.useQuery(eventId);
}

export const useGetPageNames = () => {
	return api.page.getPageNames.useQuery();
}

export const useEventPagesMutation = () => {
	const createMutation = api.page.createPage.useMutation();
	const updateMutation = api.page.updatePage.useMutation();
	const deleteMutation = api.page.deletePage.useMutation();

	return {
		create: createMutation, 
		update: updateMutation, 
		deletem: deleteMutation
	};
}

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export type EventPageComponent = React.FC<{
	linkCount: number
}>