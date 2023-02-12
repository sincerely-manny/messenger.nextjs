import * as trpc from '@trpc/server';
import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => (
    {
        session: await getServerSession(req, res, authOptions),
    }
);
type Context = inferAsyncReturnType<typeof createContext>;

const t = trpc.initTRPC.context<Context>().create();
export const { router, procedure } = t;

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const { user } = ctx.session;
    return next({
        ctx: { user },
    });
});
export const protectedProcedure = t.procedure.use(isAuthed);
