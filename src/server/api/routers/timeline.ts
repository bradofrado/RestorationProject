import { createTRPCRouter, editableProcedure, publicProcedure } from '../trpc';
import {
  type RestorationTimelineItem,
  TimelineCategorySchema,
  RestorationTimelineItemSchema,
  type PrismaTimelineItem,
  type PrismaTimelineCategory,
  TimelineCategoryArgs,
  TimelineItemArgs,
} from '~/utils/types/timeline';
import { z } from 'zod';
import { type Prisma } from '@prisma/client';
import {
  getCategories,
  getCategory,
  translatePrismaToTimelineCategory,
  translatePrismaToTimelineItem,
} from '~/server/dao/categoriesDAO';

function translateTimelineItemToPrisma(
  input: RestorationTimelineItem
): Prisma.TimelineItemUncheckedCreateInput;
function translateTimelineItemToPrisma(
  input: RestorationTimelineItem,
  update: true
): Prisma.TimelineItemUncheckedUpdateInput;
function translateTimelineItemToPrisma(
  input: RestorationTimelineItem,
  update?: boolean
):
  | Prisma.TimelineItemUncheckedCreateInput
  | Prisma.TimelineItemUncheckedUpdateInput {
  return {
    date: input.date,
    endDate: input.endDate,
    text: input.text,
    links: JSON.stringify(input.links),
    subcategory: input.subcategory,
    categories: input.categories
      ? update
        ? { set: input.categories.map((x) => ({ id: x.id })) }
        : { connect: input.categories.map((x) => ({ id: x.id })) }
      : undefined,
    type: input.type,
    x: input.x,
    y: input.y,
    mapImage: input.mapImage,
  };
}

export const timelineRouter = createTRPCRouter({
  getCategory: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      await ctx.logger.info(`GetCategory: ${input}`, ctx.session?.user);

      return await getCategory({ id: input, db: ctx.prisma });
    }),
  getCategories: publicProcedure
    .input(
      z.object({
        includeDeleted: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      await ctx.logger.info(`GetCategories`, ctx.session?.user);

      const categories = await getCategories(ctx.prisma, input.includeDeleted);

      return categories;
    }),
  createCategory: editableProcedure
    .input(TimelineCategorySchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.logger.info(
        `CreateCategory: ${JSON.stringify(input)}`,
        ctx.session.user
      );

      const dbCategory: PrismaTimelineCategory =
        await ctx.prisma.timelineCategory.create({
          data: {
            name: input.name,
            pageId: input.pageId,
            color: input.color,
            items: {
              create: input.items.map((x) => translateTimelineItemToPrisma(x)),
            },
          },
          include: TimelineCategoryArgs.include,
        });

      return translatePrismaToTimelineCategory(dbCategory);
    }),
  updateCategory: editableProcedure
    .input(TimelineCategorySchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.logger.info(
        `UpdateCategory: ${JSON.stringify(input)}`,
        ctx.session.user
      );

      const dbCategory: PrismaTimelineCategory =
        await ctx.prisma.timelineCategory.update({
          data: {
            name: input.name,
            page: {
              connect: input.pageId ? { id: input.pageId } : undefined,
              disconnect: input.pageId == null ? true : undefined,
            },
            color: input.color,
          },
          include: TimelineCategoryArgs.include,
          where: {
            id: input.id,
          },
        });

      return translatePrismaToTimelineCategory(dbCategory);
    }),
  deleteCategory: editableProcedure
    .input(
      z.object({
        id: z.number(),
        isDeleted: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.logger.info(`DeleteCategory: ${input.id}`, ctx.session.user);

      await ctx.prisma.timelineCategory.update({
        data: {
          isDeleted: input.isDeleted,
        },
        where: {
          id: input.id,
        },
      });
    }),
  createTimeline: editableProcedure
    .input(RestorationTimelineItemSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.logger.info(
        `CreateTimeline: ${JSON.stringify(input)}`,
        ctx.session.user
      );

      const dbItem: PrismaTimelineItem = await ctx.prisma.timelineItem.create({
        data: translateTimelineItemToPrisma(input),
        ...TimelineItemArgs,
      });

      return translatePrismaToTimelineItem(dbItem);
    }),
  updateTimeline: editableProcedure
    .input(RestorationTimelineItemSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.logger.info(
        `UpdateTimeline: ${JSON.stringify(input)}`,
        ctx.session.user
      );

      const dbItem: PrismaTimelineItem = await ctx.prisma.timelineItem.update({
        data: translateTimelineItemToPrisma(input, true),
        where: {
          id: input.id,
        },
        ...TimelineItemArgs,
      });

      return translatePrismaToTimelineItem(dbItem);
    }),
  deleteTimeline: editableProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ctx.logger.info(`DeleteTimeline: ${input}`, ctx.session.user);
      await ctx.prisma.timelineItem.update({
        data: {
          isDeleted: true,
        },
        where: {
          id: input,
        },
      });
    }),
});
