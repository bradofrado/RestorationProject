
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { type prisma } from "~/server/db";
import { type EventPage, PageSchema } from "~/utils/types/page";

const getPage = async ({input, db}: {input: string, db: typeof prisma }) => {
	const page: EventPage | null = await db.page.findUnique({
		where: {
			url: input
		},
		
		include: { settings: {include: {data: true}}}
	}) as EventPage | null;
	if (page == null) {
		throw new TRPCError({code: "BAD_REQUEST", message: `Invalid input: ${input}`})
	}

	return page;
}

const deletePage = async({input, db}: {input: string, db: typeof prisma}) => {
	await db.page.delete({
		where: {
			id: input
		}
	});
}

const createPage = async ({input, db}: {input: EventPage, db: typeof prisma}) => {
	const page: EventPage = await db.page.create({
		data: {
			id: input.id || undefined,
			title: input.title,
			description: input.description,
			url: input.url,
			settings: {
				create: input.settings.map(x => {
					const setting: Prisma.ComponentSettingsCreateWithoutPageInput = {
						component: x.component
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

	return page;
}

export const pageRouter = createTRPCRouter({
	getPages: publicProcedure
		.query(async ({ ctx }) => {
			const pages: EventPage[] = await ctx.prisma.page.findMany({
				include: { settings: {include: {data: true }}}
			}) as EventPage[];

			return pages;
		}),
	getPage: publicProcedure
		.input(z.string())
		.query(async ({ input, ctx }) => {
			return await getPage({input, db: ctx.prisma})
		}),
	createPage: publicProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			input.id = ''; //autogenerate an id
			return await createPage({input, db: ctx.prisma})
		}),
	deletePage: publicProcedure
		.input(z.string())
		.mutation(async ({ctx, input}) => {
			await deletePage({input, db: ctx.prisma})
		}),
	updatePage: publicProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			await deletePage({input: input.id, db: ctx.prisma});
			const page: EventPage = await createPage({input: input, db: ctx.prisma});
			
			return page;
		})
});
