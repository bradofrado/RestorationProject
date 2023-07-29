import { api } from "../api";

export const useGetCategory = (category: string) => {
	return api.timeline.getCategory.useQuery(category);
}

export const useGetCategories = () => {
	return api.timeline.getCategories.useQuery();
}

export const useCategoryMutations = () => {
	const createMutation = api.timeline.createCategory.useMutation();
	const updateMutation = api.timeline.updateCategory.useMutation();
	const deleteMutation = api.timeline.deleteCategory.useMutation();

	return {
		create: createMutation, 
		update: updateMutation,
		deletem: deleteMutation,

	}
}

export const useTimelineMutations = () => {
	const createMutation = api.timeline.createTimeline.useMutation();
	const updateMutation = api.timeline.updateTimeline.useMutation();
	const deleteMutation = api.timeline.deleteTimeline.useMutation();

	return {
		create: createMutation,
		update: updateMutation,
		deletem: deleteMutation
	}
}

