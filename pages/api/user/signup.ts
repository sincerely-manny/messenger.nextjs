import { Prisma, PrismaClient } from '@prisma/client';
import { StatusCode } from 'api-types/general';
import Rest from 'api-types/rest';
import { SignUpInputs, SignUpResponse, SignUpSchema } from 'api-types/signup';
import { hash } from 'bcrypt';
import { ValidationError } from 'yup';

class SignUp extends Rest<SignUpInputs, SignUpResponse> {
    post = async () => {
        const { body } = this.request;
        let parsedBody: SignUpInputs;
        try {
            parsedBody = SignUpSchema.validateSync(body, { stripUnknown: true });
        } catch (err) {
            this.respond(StatusCode.BadRequest, {
                status: 'error',
                message: err instanceof ValidationError ? err.message : 'Unknown validation error',
                payload: err instanceof ValidationError ? err : undefined,
            });
            return;
        }

        const prisma = new PrismaClient();

        try {
            const usersWithSameLogin = await prisma.user.count({
                where: {
                    login: parsedBody.login,
                },
            });
            if (usersWithSameLogin !== 0) {
                throw new ValidationError('This login is already taken', parsedBody.login, 'login');
            }
            const usersWithSameEmail = await prisma.user.count({
                where: {
                    email: parsedBody.email,
                },
            });
            if (usersWithSameEmail !== 0) {
                throw new ValidationError('User with this e-mail is already registred', parsedBody.email, 'email');
            }
        } catch (err) {
            this.respond(StatusCode.BadRequest, {
                status: 'error',
                message: err instanceof ValidationError ? err.message : 'Unknown error cheking for unique fields',
                payload: err instanceof ValidationError ? err : undefined,
            });
            return;
        }

        const dataToDB = {
            name: parsedBody.name,
            email: parsedBody.email,
            login: parsedBody.login,
            password: await hash(parsedBody.password, 10),
        };

        try {
            const user = await prisma.user.create({
                data: dataToDB,
            });
            this.respond(StatusCode.Ok, {
                status: 'ok',
                payload: {
                    id: user.id.toString(),
                },
            });
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

export default new SignUp().handler;
