import { createTRPCRouter } from "~/server/api/trpc";
import { homeRouter } from "~/server/api/routers/home";
import { pageRouter } from "./routers/page";
import { timelineRouter } from "./routers/timeline";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  home: homeRouter,
	page: pageRouter,
	timeline: timelineRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
