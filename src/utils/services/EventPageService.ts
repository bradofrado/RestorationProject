import { api } from '~/utils/api';
import { type RestorationTimelineItem } from '../types/timeline';

export const useGetPages = () => {
  return api.page.getPages.useQuery();
};

export const useGetPage = (eventId: string) => {
  return api.page.getPage.useQuery(eventId);
};

export const useEventPagesMutation = () => {
  const createMutation = api.page.createPage.useMutation();
  const updateMutation = api.page.updatePage.useMutation();
  const deleteMutation = api.page.deletePage.useMutation();

  return {
    create: createMutation,
    update: updateMutation,
    deletem: deleteMutation,
  };
};

export const useComponentSettingsMutation = () => {
  const createMutation = api.page.createSetting.useMutation();
  const updateMutation = api.page.updateSetting.useMutation();
  const deleteMutation = api.page.deleteSetting.useMutation();
  const reorderMutation = api.page.updateSettingOrder.useMutation();

  return {
    create: createMutation,
    update: updateMutation,
    deletem: deleteMutation,
    reorder: reorderMutation,
  };
};

type GetPageUrl =
  | {
      data: undefined;
      isLoading: true;
      isError: false;
    }
  | {
      data: undefined;
      isLoading: false;
      isError: true;
      error: ReturnType<typeof useGetPages>['error'];
    }
  | {
      data: (pageId: string) => string;
      isLoading: false;
      isError: false;
    };
export const useGetPageUrl = (): GetPageUrl => {
  const query = useGetPages();
  const throwError = (pageId: string) => {
    throw new DOMException(`Invalid pageId ${pageId}`);
  };
  if (query.isLoading) {
    return {
      data: undefined,
      isLoading: true,
      isError: false,
    };
  }

  if (query.isError) {
    return {
      data: undefined,
      isLoading: false,
      isError: true,
      error: query.error,
    };
  }

  const pages = query.data;

  return {
    data: (pageId: string) =>
      pages.find((x) => x.id == pageId)?.url || throwError(pageId),
    isLoading: false,
    isError: false,
  };
};

export const countLinks = (items: RestorationTimelineItem[]) => {
  return items.reduce((prev, curr) => prev + curr.links.length, 0);
};

export type EventPageComponent = React.FC<{
  linkCount: number;
}>;
