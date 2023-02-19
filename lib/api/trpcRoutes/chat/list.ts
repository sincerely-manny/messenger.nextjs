import { protectedProcedure } from 'lib/api/trpc';

const list = protectedProcedure
    .query(async ({ ctx: { user, prisma } }) => {
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: user.id,
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
