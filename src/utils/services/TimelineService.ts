import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { type RestorationTimelineItem, type TimelineCategoryName } from "../types/timeline";

export class TimelineService {
	getItems(): RestorationTimelineItem[] {
		const query = api.timeline.getItems.useQuery();

		return query.data || [];
	}

	getCategory(category: TimelineCategoryName) {
		const query = api.timeline.getCategory.useQuery(category);

		return query;
	}

	getCategories() {
		const query = api.timeline.getCategories.useQuery();

		return query.data || [];
	}
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

	const invalidate = <T>(func: (page: T) => void) => {
		return (page: T) => {
			func(page);
			void queryClient.invalidateQueries();
		}
	}

	return {
		create: invalidate(createMutation.mutate), 
		update: invalidate(updateMutation.mutate)
	}
}


