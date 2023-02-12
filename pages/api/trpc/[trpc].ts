import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from 'lib/api/trpc';
import { appRouter } from 'lib/api/trpcRouter';

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
});
