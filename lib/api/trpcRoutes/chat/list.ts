import { PrismaClient } from '@prisma/client';
import { protectedProcedure } from 'lib/api/trpc';

const list = protectedProcedure
    .query(async ({ ctx }) => {
        const prisma = new PrismaClient();

        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: ctx.user.id,
                    },
                },
            },
            include: {
                users: true,
            },
        });

        return chats;
    });

export default list;
