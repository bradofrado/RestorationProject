import { api } from "~/utils/api";
import { type RestorationTimelineItem } from "../types/timeline";
import { useQueryClient } from "@tanstack/react-query";

const useEventPages = () => {
	return api.page.getPages.useQuery();
}

export const useEventPage = (eventId: string) => {
	return api.page.getPage.useQuery(eventId);
}

export const useEventPagesMutation = () => {
	const queryClient = useQueryClient()
	const createMutation = api.page.createPage.useMutation();
	const updateMutation = api.page.updatePage.useMutation();
	const deleteMutation = api.page.deletePage.useMutation();

	const invalidate = <T>(func: (page: T) => void) => {
		return (page: T) => {
			func(page);
			void queryClient.invalidateQueries();
		}
	}
	
	return {
		create: invalidate(createMutation.mutate), 
		update: invalidate(updateMutation.mutate), 
		deletem: invalidate(deleteMutation.mutate)
	};
}

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export type EventPageComponent = React.FC<{
	linkCount: number
}>

export default useEventPages;