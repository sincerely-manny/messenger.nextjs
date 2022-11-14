import { ValidationError } from 'yup';
import { StatusCode } from '../../../api-types/general';
import Rest from '../../../api-types/rest';
import { SignUpInputs, SignUpSchema } from '../../../api-types/signup';

class SignUp extends Rest<SignUpInputs, unknown> {
    post = () => {
        const { body } = this.request;
        try {
            const parsedBody = SignUpSchema.validateSync(body, { stripUnknown: true });
            this.response.status(StatusCode.Ok).json({
                status: 'ok',
                payload: parsedBody,
            });
        } catch (err) {
            const message = err instanceof ValidationError ? err.message : 'Validation error';
            this.response?.status(StatusCode.BadRequest).json({
                status: 'error',
                message,
            });
        }
    };
}

export default new SignUp().handler;
