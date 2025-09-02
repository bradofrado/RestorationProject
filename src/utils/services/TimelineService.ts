import { api } from '../api';

export const useGetCategory = (categoryId: number) => {
  return api.timeline.getCategory.useQuery(categoryId);
};

export const useGetCategories = (
  options: { includeDeleted?: boolean } = {}
) => {
  return api.timeline.getCategories.useQuery(options);
};

export const useCategoryMutations = () => {
  const createMutation = api.timeline.createCategory.useMutation();
  const updateMutation = api.timeline.updateCategory.useMutation();
  const deleteMutation = api.timeline.deleteCategory.useMutation();

  return {
    create: createMutation,
    update: updateMutation,
    deletem: deleteMutation,
  };
};

export const useTimelineMutations = () => {
  const createMutation = api.timeline.createTimeline.useMutation();
  const updateMutation = api.timeline.updateTimeline.useMutation();
  const deleteMutation = api.timeline.deleteTimeline.useMutation();

  return {
    create: createMutation,
    update: updateMutation,
    deletem: deleteMutation,
  };
};
