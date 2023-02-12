import { router } from 'lib/api/trpc';
import send from './send';

const message = router({
    send,
});

export default message;
