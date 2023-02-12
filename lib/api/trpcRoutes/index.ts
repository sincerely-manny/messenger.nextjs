import * as yup from 'yup';
import { procedure } from '../trpc';
import chat from './chat';
import message from './message';
import pusherAppConfig from './pusherAppConfig';

export default {
    hello: procedure
        .input(
            yup.object({
                greeting: yup.string().required(),
            }),
        )
        .query(({ input }) => ({
            text: `hello ${input.greeting}`,
        })),
    pusherAppConfig,
    message,
    chat,
};
