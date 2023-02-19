import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import Pusher from 'pusher';
import superjson from 'superjson';
import { pusherConfig } from './pusher';

export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => (
    {
        session: await getServerSession(req, res, authOptions),
    }
);
type Context = inferAsyncReturnType<typeof createContext>;

const t = trpc.initTRPC.context<Context>().create({
    transformer: superjson,
});
export const { router, procedure } = t;

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const { user } = ctx.session;
    const prisma = new PrismaClient();
    const pusher = new Pusher(pusherConfig);
    return next({
        ctx: { user, prisma, pusher },
    });
});
export const protectedProcedure = t.procedure.use(isAuthed);
