import Pusher from 'pusher';
import * as Yup from 'yup';
import { Message } from '../message';
import { pusherConfig, PUSHER_PRIVATE_CHANNEL_PREFIX } from '../pusher';
import { protectedProcedure } from '../trpc';

const sendMessage = protectedProcedure
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

export default sendMessage;
