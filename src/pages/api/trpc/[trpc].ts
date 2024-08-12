import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/router';

import { getServerAuthSession } from '../../../server/auth';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });
  return { session };
};

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

export type ContextType = Awaited<ReturnType<typeof createContext>>;
