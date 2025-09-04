import {
  type ComponentSettings,
  type EventPage,
  type PrismaComponentSettings,
  type PrismaPage,
} from '~/utils/types/page';
import { exclude } from '~/utils/utils';
import { type Db } from '../db';
import { TRPCError } from '@trpc/server';

export const prismaToPage = (prismaPage: PrismaPage): EventPage => {
  const page = exclude(prismaPage, 'isDeleted');

  page.settings = page.settings
    .filter((x) => !x.isDeleted)
    .sort((a, b) => a.order - b.order);

  return page as EventPage;
};

export const prismaToComponent = (
  prismaComponent: PrismaComponentSettings
): ComponentSettings => {
  return exclude(prismaComponent, 'isDeleted') as ComponentSettings;
};

export const getPage = async ({ input, db }: { input: string; db: Db }) => {
  const prismaPage = await db.page.findFirst({
    where: {
      url: input,
      isDeleted: false,
    },

    include: { settings: { include: { data: true } } },
  });
  if (prismaPage == null) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invalid input: ${input}`,
    });
  }

  return prismaToPage(prismaPage);
};

export const getPages = async ({
  db,
  isPublished,
}: {
  db: Db;
  isPublished?: boolean;
}) => {
  const pages = await db.page.findMany({
    include: { settings: { include: { data: true } } },
    where: {
      isDeleted: false,
      isPublished,
    },
  });

  return pages.map((page) => prismaToPage(page));
};
