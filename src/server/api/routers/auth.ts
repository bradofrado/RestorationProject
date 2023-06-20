import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type User, signupSchema } from "~/utils/types/auth";
import { signup } from "~/server/dao/authDAO";


export const authRouter = createTRPCRouter({
    signup: publicProcedure
        .input(signupSchema)
        .mutation(async ({input, ctx}): Promise<User> => {
            return await signup({input, db: ctx.prisma});
        }),
})