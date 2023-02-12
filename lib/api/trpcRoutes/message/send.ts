import Pusher from 'pusher';
import * as Yup from 'yup';
import { Message } from 'lib/api/message';
import { pusherConfig, PUSHER_PRIVATE_CHANNEL_PREFIX } from 'lib/api/pusher';
import { protectedProcedure } from 'lib/api/trpc';

const send = protectedProcedure
    .input(
        new Yup.ObjectSchema<Message>(),
    )
    .mutation(async ({ ctx, input }) => {
        const pusher = new Pusher(pusherConfig);
        const { id: senderId } = ctx.user;
        const message = {
            ...input,
            senderId,
            timestamp: Date.now().toString(),
        };

        await pusher.trigger(`${PUSHER_PRIVATE_CHANNEL_PREFIX}${senderId}`, 'message', message);
    });

export default send;
