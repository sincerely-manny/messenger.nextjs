import { Chat, PrismaClient } from '@prisma/client';
import { ApiResponse, StatusCode } from 'lib/api/general';
import Rest from 'lib/api/rest';

class List extends Rest<undefined, ApiResponse<Chat[]>> {
    get = async () => {
        const session = await this.checkSession();
        if (!session) {
            return;
        }

        const prisma = new PrismaClient();

        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: session.user.id,
                    },
                },
            },
            include: {
                users: true,
            },
        });

        this.respond(StatusCode.Ok, {
            status: 'ok',
            payload: chats,
        });
    };
}

export default new List().handler;
