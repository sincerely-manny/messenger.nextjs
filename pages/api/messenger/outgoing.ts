import { ApiResponse, StatusCode } from 'lib/api/general';
import { Message } from 'lib/api/message';
import pusherConfig, { PUSHER_PRIVATE_CHANNEL_PREFIX } from 'lib/api/pusher';
import Rest from 'lib/api/rest';
import Pusher from 'pusher';

class Outgoing extends Rest<Message, ApiResponse> {
    post = async () => {
        const session = await this.checkSession();
        if (!session) {
            return;
        }

        const pusher = new Pusher(pusherConfig);

        const clientId = session.user.id;

        const message = {
            ...this.request.body,
            senderId: clientId,
            timestamp: Date.now().toString(),
        };

        await pusher.trigger(`${PUSHER_PRIVATE_CHANNEL_PREFIX}${session.user.id}`, 'message', message);

        this.respond(StatusCode.Ok, {
            status: 'ok',
        });
    };
}

export default new Outgoing().handler;
