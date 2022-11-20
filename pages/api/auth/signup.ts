import { Prisma, PrismaClient } from '@prisma/client';
import { StatusCode } from 'api-types/general';
import Rest from 'api-types/rest';
import { SignUpInputs, SignUpResponse, SignUpSchema } from 'api-types/signup';
import { hashSync } from 'bcrypt';
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
            });
            return;
        }

        const prisma = new PrismaClient();
        const dataToDB = {
            name: parsedBody.name,
            email: parsedBody.email,
            login: parsedBody.login,
            password: hashSync(parsedBody.password, 5),
        };

        try {
            const user = await prisma.user.create({
                data: dataToDB,
            });
            this.respond(StatusCode.Ok, {
                status: 'ok',
                payload: {
                    id: user.id,
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
