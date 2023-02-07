import * as trpc from '@trpc/server';
import * as yup from 'yup';
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = trpc.initTRPC.create();
// Base router and procedure helpers
const { router, procedure } = t;

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
    pusherAppConfig: procedure
        .query(() => ({
            appKey: process.env.PUSHER_KEY,
            cluster: process.env.PUSHER_CLUSTER,
        })),
});

export type AppRouter = typeof appRouter;
