
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  editableProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Db } from "~/server/db";
import { type EventPage, PageSchema, ComponentSettingsSchema, type ComponentSettings, type PrismaPage, type PrismaComponentSettings } from "~/utils/types/page";
import { exclude } from "~/utils/utils";

const prismaToPage = (prismaPage: PrismaPage): EventPage => {
	const page = exclude(prismaPage, 'isDeleted');

	page.settings = page.settings.filter(x => !x.isDeleted).sort((a, b) => a.order - b.order);

	return page as EventPage;
}

const prismaToComponent = (prismaComponent: PrismaComponentSettings): ComponentSettings => {
	return exclude(prismaComponent, 'isDeleted') as ComponentSettings;
}

const getPage = async ({input, db}: {input: string, db: Db }) => {
	const prismaPage = await db.page.findFirst({
		where: {
			url: input,
			isDeleted: false
		},
		
		include: { settings: {include: {data: true}}}
	});
	if (prismaPage == null) {
		throw new TRPCError({code: "BAD_REQUEST", message: `Invalid input: ${input}`})
	}

	return prismaToPage(prismaPage);
}

const deletePage = async({input, db}: {input: string, db: Db}) => {
	await db.page.update({
		data: {
			isDeleted: true
		},
		where: {
			id: input
		}
	});
}

const createPage = async ({input, db}: {input: EventPage, db: Db}) => {
	const page = await db.page.create({
		data: {
			id: input.id || undefined,
			title: input.title,
			description: input.description,
			url: input.url,
			settings: {
				create: input.settings.map(x => {
					const setting: Prisma.ComponentSettingsCreateWithoutPageInput = {
						component: x.component,
						order: x.order
					}
					if (x.data) {
						setting.data = {
							create: {content: x.data.content, properties: x.data.properties}
						}
					}

					return setting;
				})
			}
		},
		include: {
			settings: {include: {data: true}}
		}
	});

	return prismaToPage(page);
}

export const pageRouter = createTRPCRouter({
	getPages: publicProcedure
		.query(async ({ ctx }) => {
			ctx.logger.info('GetPages', ctx.session?.user);

			const pages = await ctx.prisma.page.findMany({
				include: { settings: {include: {data: true }}},
				where: {
					isDeleted: false
				}
			});

			return pages.map(page => prismaToPage(page));
		}),
	getPage: publicProcedure
		.input(z.string())
		.query(async ({ input, ctx }) => {
			ctx.logger.info(`GetPage ${input}`, ctx.session?.user);
			
			return await getPage({input, db: ctx.prisma})
		}),
	getPageNames: publicProcedure
		.query(async ({ctx}) => {
			ctx.logger.info('GetPageNames', ctx.session?.user);

			const pages = await ctx.prisma.page.findMany({
				select: {url: true}
			});

			return pages.map(x => x.url);
		}),
	createPage: editableProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			input.id = ''; //autogenerate an id

			ctx.logger.info(`CreatePage: ${JSON.stringify(input)}`, ctx.session.user);

			return await createPage({input, db: ctx.prisma})
		}),
	deletePage: editableProcedure
		.input(z.string())
		.mutation(async ({ctx, input}) => {
			ctx.logger.info(`DeletePage: ${input}`, ctx.session.user);

			await deletePage({input, db: ctx.prisma})
		}),
	updatePage: editableProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			ctx.logger.info(`UpdatePage: ${JSON.stringify(input)}`, ctx.session.user);

			const page = await ctx.prisma.page.update({
				data: {
					title: input.title,
					description: input.description,
					url: input.url,
				},
				include: {
					settings: {include: {data: true}}
				},
				where: {
					id: input.id
				}
			});
			
			return prismaToPage(page);
		}),
	createSetting: editableProcedure
		.input(ComponentSettingsSchema)
		.mutation(async ({ctx, input}) => {
			ctx.logger.info(`CreateSetting: ${JSON.stringify(input)}`, ctx.session.user);

			const setting = await ctx.prisma.componentSettings.create({
				data: {
					data: {create: input.data},
					component: input.component,
					order: input.order,
					page: {
						connect: {id: input.pageId}
					}
				},
				include: {
					data: true
				}
			});
			
			return prismaToComponent(setting);
		}),
	updateSetting: editableProcedure
		.input(ComponentSettingsSchema)
		.mutation(async ({ctx, input}) => {
			ctx.logger.info(`UpdateSetting: ${JSON.stringify(input)}`, ctx.session.user);

			const setting = await ctx.prisma.componentSettings.update({
				data: {
					data: {update: input.data},
					component: input.component,
					order: input.order,
					page: {
						connect: {id: input.pageId}
					}
				},
				include: {
					data: true
				},
				where: {
					id: input.id
				}
			})

			return prismaToComponent(setting);
		}),
	updateSettingOrder: editableProcedure
		.input(z.array(z.object({id: z.number(), order: z.number()})))
		.mutation(async ({ctx, input}) => {
			ctx.logger.info(`UpdateSettingOrder: ${JSON.stringify(input)}`, ctx.session.user);

			for (const inputItem of input) {
				if (inputItem.id < 0) continue;
				await ctx.prisma.componentSettings.update({
					data: {
						order: inputItem.order
					},
					where: {
						id: inputItem.id
					}
				})
			}
		}),
	deleteSetting: editableProcedure
		.input(z.number())
		.mutation(async ({ctx, input}) => {
			ctx.logger.info(`DeleteSetting: ${input}`, ctx.session.user);
			
			await ctx.prisma.componentSettings.update({
				data: {
					isDeleted: true
				},
				where: {
					id: input
				}
			});
		}),
});
