import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ActionScope, type Action, ActionComponent, ActionType } from "~/utils/types/action";
import { type Db } from "~/server/db";
import { createSetting, updateSetting } from "./page";

export const actionRouter = createTRPCRouter({
    createAction: protectedProcedure
        .input(z.any())
        .mutation(async ({ctx, input}) => {
            if (ctx.session.user.role == 'admin') {
                await applyAction(input, ctx.prisma);
            } else {
                await createAction(input, ctx.prisma);
            }
        })
});

const createAction = async (action: Action, db: Db) => {
    
}

const applyAction = async (action: Action, db: Db) => {
    const actionMethod = actionFactory.get(action.scope);

    return await actionMethod(action, db);
}

type ActionMethod = (action: Action, db: Db) => Promise<void>

class ActionFactory {
    private methodsMap: {[key in ActionScope]: ActionMethod} = {};

    public get(scope: ActionScope) {
        return this.methodsMap[scope];
    }

    public register(scope: ActionScope, method: ActionMethod) {
        this.methodsMap[scope] = method;
    }
}

const actionFactory = new ActionFactory();
actionFactory.register(ActionScope.Component, async (action: ActionComponent, db: Db) => {
    if (action.type == ActionType.Add) {
        await createSetting(action.payload, db);
    } else if (action.type == ActionType.Edit) {
        await updateSetting(action.payload, db);
    }
})