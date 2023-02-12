import { router } from 'lib/api/trpc';
import list from './list';

const chat = router({
    list,
});

export default chat;
