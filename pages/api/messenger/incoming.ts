import Rest from 'lib/api/rest';
import ServerSentEvents, { ServerSentEventType } from 'lib/sse/serverSentEvents';

// curl -Nv localhost:3000/api/messenger/incoming

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

class Incoming extends Rest {
    eventStream = () => {
        // const session = await this.checkSession();
        // if (!session) {
        //     return;
        // }

        const sse = ServerSentEvents.getInstance();

        // const clientId = session.user.id;
        const clientId = 'clb8porik0000rip3uppbqxgx';

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
