'use client';

import { createContext, useContext } from 'react';
import { api } from '../api';
import { type TimelineCategory } from '../types/timeline';

interface CategoryContextType {
  categories: TimelineCategory[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: TimelineCategory[];
}) => {
  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useGetCategory = (categoryId: number) => {
  const context = useContext(CategoryContext);
  if (!context) {
    return api.timeline.getCategory.useQuery(categoryId);
  }

  const data = context.categories.find((x) => x.id === categoryId);
  if (!data) {
    return {
      isError: true,
      isLoading: false,
      data: undefined,
    } as const;
  }

  return {
    isError: false,
    isLoading: false,
    data,
  } as const;
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
