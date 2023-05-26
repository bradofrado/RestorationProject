
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { type EventPage, PageSchema } from "~/utils/types/page";

export const pageRouter = createTRPCRouter({
	getPage: publicProcedure
		.input(z.string())
		.query(async ({ input, ctx }) => {
			const page: EventPage | null = await ctx.prisma.page.findUnique({
				where: {
					id: input
				},
				
				include: { settings: {include: {data: true}}}
			}) as EventPage | null;
			if (page == null) {
				throw new TRPCError({code: "BAD_REQUEST", message: `Invalid input: ${input}`})
			}

			return page;
		}),
	createPage: publicProcedure
		.input(PageSchema)
		.mutation(async ({ctx, input}) => {
			const page: EventPage = await ctx.prisma.page.create({
				data: {
					id: input.id,
					title: input.title,
					description: input.description,
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
		})
});
