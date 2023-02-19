import { router } from 'lib/api/trpc';
import list from './list';
import send from './send';

const message = router({
    send,
    list,
});

export default message;
