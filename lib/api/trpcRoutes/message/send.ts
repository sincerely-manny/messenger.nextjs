import { Message } from '@prisma/client';
import { PUSHER_PRIVATE_CHANNEL_PREFIX } from 'lib/api/pusher';
import { protectedProcedure } from 'lib/api/trpc';
import * as Yup from 'yup';

const send = protectedProcedure
    .input(
        new Yup.ObjectSchema<Message>(),
    )
    .mutation(async ({ ctx: { user, prisma, pusher }, input }) => {
        const { id: userId } = user;
        const message = {
            ...input,
            userId,
            sentAt: new Date(),
        };
        const query = await prisma.message.create({ data: message });

        await pusher.trigger(`${PUSHER_PRIVATE_CHANNEL_PREFIX}${userId}`, 'message', message);

        return query;
    });

export default send;
