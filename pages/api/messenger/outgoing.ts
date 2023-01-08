import { ApiResponse, StatusCode } from 'lib/api/general';
import { Message } from 'lib/api/message';
import Rest from 'lib/api/rest';
import ServerSentEvents, { ServerSentEvent } from 'lib/sse/serverSentEvents';

class Outgoing extends Rest<Message, ApiResponse> {
    post = async () => {
        const session = await this.checkSession();
        if (!session) {
            return;
        }

        const sse = ServerSentEvents.getInstance();

        const clientId = session.user.id;

        const message = {
            ...this.request.body,
            senderId: clientId,
            timestamp: Date.now().toString(),
        };

        sse.send({
            message,
            type: ServerSentEvent.MESSAGE,
            clientId,
        });

        this.respond(StatusCode.Ok, {
            status: 'ok',
        });
    };
}

export default new Outgoing().handler;
