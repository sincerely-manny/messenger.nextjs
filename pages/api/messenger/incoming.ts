import { NextApiRequest, NextApiResponse } from 'next';
// import { nanoid } from '@reduxjs/toolkit';
// import { Message } from 'lib/api/message';
// import Rest from 'lib/api/rest';
import ServerSentEvents, { ServerSentEvent } from 'lib/sse/serverSentEvents';
import { StatusCode } from 'lib/api/general';
import { nanoid } from '@reduxjs/toolkit';
import { Message } from 'lib/api/message';

// curl -Nv localhost:3000/api/messenger/incoming --header "Accept: text/event-stream"

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

// class Incoming extends Rest {
//     eventStream = () => {
//         // const session = await this.checkSession();
//         // if (!session) {
//         //     return;
//         // }

//         // const sse = ServerSentEvents.getInstance();

//         // const clientId = session.user.id;
//         // const clientId = 'clb8porik0000rip3uppbqxgx';

//         // sse.connect(clientId, this.response, this.request.headers);

//         this.response.setHeader('Access-Control-Allow-Origin', '*');
//         this.response.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
//         this.response.setHeader('Cache-Control', 'no-cache, no-transform');
//         this.response.setHeader('X-Accel-Buffering', 'no');

//         for (let i = 0; i < 5; i++) {
//             this.response.write(`data: !Hello seq ${i}\n\n`);
//         }

//         // sse.send({
//         //     message: 'connected',
//         //     type: ServerSentEvent.HANDSHAKE,
//         //     clientId,
//         // });

//         // sse.send({
//         //     message: {
//         //         text: 'HELLOOOOO!!!',
//         //         id: nanoid(),
//         //         senderId: clientId,
//         //     } as Message,
//         //     type: ServerSentEvent.MESSAGE,
//         //     clientId,
//         // });

//         // setTimeout(() => {
//         //     sse.send({
//         //         message: {
//         //             text: 'HELLOOOOO 5 sec later!!!',
//         //             id: nanoid(),
//         //             senderId: clientId,
//         //         } as Message,
//         //         type: ServerSentEvent.MESSAGE,
//         //         clientId,
//         //     });
//         // }, 5000);

//         // this.response.on('close', () => {
//         //     sse.disconnect(clientId);
//         // });
//     };
// }

// export default new Incoming().handler;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Content-Encoding', 'none');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(StatusCode.Ok);

    const sse = ServerSentEvents.getInstance();
    const clientId = 'clb8porik0000rip3uppbqxgx';
    sse.connect(clientId, res, req.headers);

    for (let i = 0; i < 5; i++) {
        res.write(`data: Hello seq ${i}\n\n`);
    }

    // sse.send({
    //     message: 'connected',
    //     type: ServerSentEvent.HANDSHAKE,
    //     clientId,
    // });

    // sse.send({
    //     message: {
    //         text: 'HELLOOOOO!!!',
    //         id: nanoid(),
    //         senderId: clientId,
    //     } as Message,
    //     type: ServerSentEvent.MESSAGE,
    //     clientId,
    // });

    // setTimeout(() => {
    //     sse.send({
    //         message: {
    //             text: 'HELLOOOOO 5 sec later!!!',
    //             id: nanoid(),
    //             senderId: clientId,
    //         } as Message,
    //         type: ServerSentEvent.MESSAGE,
    //         clientId,
    //     });
    // }, 5000);

    res.on('close', () => {
        sse.disconnect(clientId);
    });

    // res.end('done\n');
};

export default handler;
