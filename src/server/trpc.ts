import { ContextType } from '@/pages/api/trpc/[trpc]';
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<ContextType>().create({
  transformer: superjson,
});

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const router = t.router;
export const procedure = t.procedure;
