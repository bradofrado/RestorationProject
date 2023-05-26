/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { isTimelinePage, isEventPage, type EventPage } from "~/utils/types/page";

const validateTimelinePageType = (val: unknown) => {
	if (typeof val === 'string' && isTimelinePage(val)) {
		return val;
	}

	throw new TRPCError({code: "BAD_REQUEST", message: `Invalid input: ${typeof val}`});
}

export const pageRouter = createTRPCRouter({
	getPage: publicProcedure
		.input(validateTimelinePageType)
		.query(async ({ input, ctx }) => {
			const page: EventPage | null = await ctx.prisma.page.findUnique({
				where: {
					id: input
				},
				include: { settings: {include: {data: true}}}
			});
			if (page == null) {
				throw new TRPCError({code: "BAD_REQUEST", message: `Invalid input: ${input}`})
			}

			return page;
		}),
	createPage: publicProcedure
		.input((val: unknown) => {
			if (val && typeof val == 'object' && isEventPage(val)) {
				return val;
			}

			throw new TRPCError({code: "BAD_REQUEST", message: `Invalid type ${typeof val}`});
		})
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
			});

			return page;
		})
});
