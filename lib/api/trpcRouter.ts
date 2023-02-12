import { router } from './trpc';
import routes from './trpcRoutes';

export const appRouter = router(routes);

export type AppRouter = typeof appRouter;
