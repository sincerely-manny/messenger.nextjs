import * as trpc from '@trpc/server';
import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import * as yup from 'yup';

export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => (
    {
        session: await getServerSession(req, res, authOptions),
    }
);
type Context = inferAsyncReturnType<typeof createContext>;

const t = trpc.initTRPC.context<Context>().create();
const { router, procedure } = t;

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            user: ctx.session?.user,
        },
    });
});
const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = router({
    hello: procedure
        .input(
            yup.object({
                greeting: yup.string().required(),
            }),
        )
        .query(({ input }) => ({
            text: `hello ${input.greeting}`,
        })),
    pusherAppConfig: protectedProcedure
        .query(() => ({
            appKey: process.env.PUSHER_KEY,
            cluster: process.env.PUSHER_CLUSTER,
        })),
});

export type AppRouter = typeof appRouter;
