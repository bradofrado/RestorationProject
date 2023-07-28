import { createTRPCRouter } from "~/server/api/trpc";
import { pageRouter } from "./routers/page";
import { timelineRouter } from "./routers/timeline";
import { authRouter } from "./routers/auth";
import { actionRouter } from "./routers/action";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    page: pageRouter,
	timeline: timelineRouter,
	auth: authRouter,
	action: actionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
