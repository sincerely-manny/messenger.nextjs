import { protectedProcedure } from 'lib/api/trpc';
import * as yup from 'yup';

const list = protectedProcedure
    .input(
        yup.string().required(),
    )
    .query(({ input: chatId, ctx: { prisma } }) => {
        const messages = prisma.message.findMany({
            where: {
                chatId,
            },
            orderBy: {
                sentAt: 'asc',
            },
        });

        return messages;
    });

export default list;
