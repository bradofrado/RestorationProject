import { type EventPage } from "~/utils/types/page";
import { api } from "~/utils/api";
import { type RestorationTimelineItem } from "../types/timeline";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { TRPCClientErrorLike } from "@trpc/client";

const useEventPages = () => {
	return api.page.getPages.useQuery();
}

export const useEventPage = (eventId: string) => {
	return api.page.getPage.useQuery(eventId);
}

export const useEventPagesMutation = () => {
	const createMutation = api.page.createPage.useMutation();
	const updateMutation = api.page.updatePage.useMutation();
	const deleteMutation = api.page.deletePage.useMutation();
	
	return {create: createMutation.mutate, update: updateMutation.mutate, deletem: deleteMutation.mutate};
}

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export type EventPageComponent = React.FC<{
	linkCount: number
}>

export default useEventPages;