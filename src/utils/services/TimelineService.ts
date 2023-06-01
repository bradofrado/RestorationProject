import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { type TimelineCategoryName } from "../types/timeline";

export const useGetItems = () => {
	return api.timeline.getItems.useQuery();
}

export const useGetCategory = (category: number) => {
	return api.timeline.getCategory.useQuery(category);
}

export const useGetCategories = () => {
	return api.timeline.getCategories.useQuery();
}

export const useCategoryMutations = () => {
	const queryClient = useQueryClient();
	const createMutation = api.timeline.createCategory.useMutation();
	const updateMutation = api.timeline.updateCategory.useMutation();
	const deleteMutation = api.timeline.deleteCategory.useMutation();

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
	}
}

export const useTimelineMutations = () => {
	const queryClient = useQueryClient();
	const createMutation = api.timeline.createTimeline.useMutation();
	const updateMutation = api.timeline.updateTimeline.useMutation();
	const deleteMutation = api.timeline.deleteTimeline.useMutation();

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
	}
}


