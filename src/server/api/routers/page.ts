
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  criticalProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Db } from "~/server/db";
import { type EventPage, PageSchema, ComponentSettingsSchema, type ComponentSettings } from "~/utils/types/page";

const getPage = async ({input, db}: {input: string, db: Db }) => {
	const page: EventPage | null = await db.page.findUnique({
		where: {
			url: input
		},
		
		include: { settings: {include: {data: true}}}
	}) as EventPage | null;
	if (page == null) {
		throw new TRPCError({code: "BAD_REQUEST", message: `Invalid input: ${input}`})
	}

	page.settings.sort((a, b) => a.order - b.order);
	return page;
}

const deletePage = async({input, db}: {input: string, db: Db}) => {
	await db.page.delete({
		where: {
			id: input
		}
	});
}

const createPage = async ({input, db}: {input: EventPage, db: Db}) => {
	const page: EventPage = await db.page.create({
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
	}) as EventPage;

	page.settings.sort((a, b) => a.order - b.order);

	return page;
}

export const pageRouter = createTRPCRouter({
	getPages: publicProcedure
		.query(async ({ ctx }) => {
			const pages: EventPage[] = await ctx.prisma.page.findMany({
				include: { settings: {include: {data: true }}}
			}) as EventPage[];

			return pages.map(page => ({...page, settings: page.settings.slice().sort((a, b) => a.order - b.order)}));
		}),
	getPage: publicProcedure
		.input(z.string())
		.query(async ({ input, ctx }) => {
			return await getPage({input, db: ctx.prisma})
		}),
	getPageNames: publicProcedure
		.query(async ({ctx}) => {
			const pages = await ctx.prisma.page.findMany({
				select: {url: true}
			});

			return pages.map(x => x.url);
		}),
	createPage: criticalProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			input.id = ''; //autogenerate an id
			return await createPage({input, db: ctx.prisma})
		}),
	deletePage: criticalProcedure
		.input(z.string())
		.mutation(async ({ctx, input}) => {
			await deletePage({input, db: ctx.prisma})
		}),
	updatePage: criticalProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			const page: EventPage = await ctx.prisma.page.update({
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
			}) as EventPage;

			return page;
		}),
	createSetting: criticalProcedure
		.input(ComponentSettingsSchema)
		.mutation(async ({ctx, input}) => {
			const setting: ComponentSettings = await ctx.prisma.componentSettings.create({
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
			}) as ComponentSettings;

			return setting;
		}),
	updateSetting: criticalProcedure
		.input(ComponentSettingsSchema)
		.mutation(async ({ctx, input}) => {
			const setting: ComponentSettings = await ctx.prisma.componentSettings.update({
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
			}) as ComponentSettings

			return setting;
		}),
	updateSettingOrder: criticalProcedure
		.input(z.array(z.object({id: z.number(), order: z.number()})))
		.mutation(async ({ctx, input}) => {
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
	deleteSetting: criticalProcedure
		.input(z.number())
		.mutation(async ({ctx, input}) => {
			await ctx.prisma.componentSettings.delete({
				where: {
					id: input
				}
			});
		}),
});
