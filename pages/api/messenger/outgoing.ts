import { nanoid } from '@reduxjs/toolkit';
import { ApiResponse, StatusCode } from 'lib/api/general';
import { Message } from 'lib/api/message';
import Rest from 'lib/api/rest';
import ServerSentEvents, { ServerSentEventType } from 'lib/sse/serverSentEvents';

class Outgoing extends Rest<{ message: string }, ApiResponse> {
    post = async () => {
        const session = await this.checkSession();
        if (!session) {
            return;
        }

        // console.log('global.processId', global.processId);

        const sse = ServerSentEvents.getInstance();

        const clientId = session.user.id;

        // console.log(clientId, this.request.body.message);

        sse.send({
            message: {
                text: this.request.body.message,
                id: nanoid(),
                senderId: clientId,
            } as Message,
            type: ServerSentEventType.MESSAGE,
            clientId,
        });

        this.respond(StatusCode.Ok, {
            status: 'ok',
        });
    };
}

export default new Outgoing().handler;
