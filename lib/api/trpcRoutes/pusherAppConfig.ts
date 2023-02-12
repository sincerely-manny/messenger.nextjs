import { protectedProcedure } from '../trpc';

const pusherAppConfig = protectedProcedure
    .query(() => ({
        appKey: process.env.PUSHER_KEY,
        cluster: process.env.PUSHER_CLUSTER,
    }));

export default pusherAppConfig;
