import Rest from 'lib/api/rest';
import ServerSentEvents, { ServerSentEventType } from 'lib/sse/serverSentEvents';

// curl -Nv localhost:3000/api/messenger/incoming

class Incoming extends Rest {
    eventStream = async () => {
        const session = await this.checkSession();
        if (!session) {
            return;
        }

        const sse = ServerSentEvents.getInstance();

        const clientId = session.user.id;

        sse.connect(clientId, this.response, this.request.headers);

        sse.send({
            message: 'connected',
            type: ServerSentEventType.HANDSHAKE,
            clientId,
        });

        this.response.on('close', () => {
            sse.disconnect(clientId);
        });
    };
}

export default new Incoming().handler;
