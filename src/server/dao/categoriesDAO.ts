import {
  type PrismaTimelineCategory,
  type PrismaTimelineItem,
  type RestorationTimelineItem,
  type TimelineCategory,
  TimelineCategoryArgs,
  TimelineCategorySchema,
} from '~/utils/types/timeline';
import { type Db } from '../db';
import { exclude } from '~/utils/utils';
import { TRPCError } from '@trpc/server';

export const getCategories = async (
  db: Db,
  includeDeleted = false
): Promise<TimelineCategory[]> => {
  const dbCategories: PrismaTimelineCategory[] =
    await db.timelineCategory.findMany({
      include: TimelineCategoryArgs.include,
      ...(!includeDeleted
        ? {
            where: {
              isDeleted: false,
            },
          }
        : undefined),
    });

  return dbCategories.map((category) =>
    translatePrismaToTimelineCategory(category, includeDeleted)
  );
};

export const getCategory = async ({ db, id }: { db: Db; id: number }) => {
  const dbCategory: PrismaTimelineCategory | null =
    await db.timelineCategory.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: TimelineCategoryArgs.include,
    });
  if (dbCategory == null) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invalid input ${id}`,
    });
  }

  return translatePrismaToTimelineCategory(dbCategory);
};

export const translatePrismaToTimelineItem = (
  item: PrismaTimelineItem
): RestorationTimelineItem => {
  return exclude(
    { ...item, links: item.links.split(',').filter((x) => x != '') },
    'isDeleted'
  );
};

export const translatePrismaToTimelineCategory = (
  category: PrismaTimelineCategory,
  includeDeleted = false
): TimelineCategory => {
  const items = sortTimelineItems(
    category.items
      .filter((x) => !x.isDeleted)
      .map(translatePrismaToTimelineItem)
  );
  return TimelineCategorySchema.parse(
    includeDeleted
      ? { ...category, items }
      : exclude({ ...category, items }, 'isDeleted')
  );
};

const sortTimelineItems = (
  items: RestorationTimelineItem[]
): RestorationTimelineItem[] => {
  return items.slice().sort((a, b) => {
    if (!a.date) {
      return -1;
    }

    if (!b.date) {
      return 1;
    }

    return a.date.valueOf() - b.date.valueOf();
  });
};
