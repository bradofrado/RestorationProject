import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext(),
  });
};

export const GET = handler;
export const POST = handler;
