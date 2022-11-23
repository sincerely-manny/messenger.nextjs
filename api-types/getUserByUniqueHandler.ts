import { Prisma, PrismaClient, User } from '@prisma/client';
import { ApiResponse, StatusCode } from 'api-types/general';
import Rest from 'api-types/rest';

const getUserByUniqueHandler = <T extends 'login' | 'email' | 'id'>(field: T) => {
    class Search extends Rest<undefined, ApiResponse<User | null>, { [key in T]: string }> {
        get = async () => {
            if (this.query === undefined || this.query[field] === undefined) {
                this.respond(StatusCode.BadRequest, {
                    status: 'error',
                    message: 'No query specified',
                });
                return;
            }

            const prisma = new PrismaClient();
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        [field]: field === 'id' ? parseInt(this.query[field], 10) : this.query[field],
                    },
                });
                if (user !== null) {
                    // user.password = '';
                    this.respond(StatusCode.Ok, {
                        status: 'ok',
                        payload: user,
                    });
                } else {
                    this.respond(StatusCode.NotFound, {
                        status: 'error',
                        payload: user,
                        message: 'User not found',
                    });
                }
            } catch (err) {
                this.respond(StatusCode.BadRequest, {
                    status: 'error',
                    message: err instanceof Prisma.PrismaClientKnownRequestError ? err.message : 'Unknown DB error',
                });
            } finally {
                await prisma.$disconnect();
            }
        };
    }

    return new Search().handler;
};

export default getUserByUniqueHandler;
