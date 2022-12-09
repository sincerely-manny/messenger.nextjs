import { nanoid } from '@reduxjs/toolkit';
import { StatusCode } from 'lib/api/general';
import { Message } from 'lib/api/message';
import ServerSentEvents, { ServerSentEventType } from 'lib/sse/serverSentEvents';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// curl -Nv localhost:3000/api/messenger
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    // res.setHeader('X-Accel-Buffering', 'no');

    const session = await unstable_getServerSession(req, res, authOptions);
    if (session === null) {
        res.status(StatusCode.Unauthorized);
        res.end('Unauthorized\n');
        return;
    }

    const sse = ServerSentEvents.getInstance();

    const clientId = session.user.id;

    sse.connect(clientId, res);

    // console.log('connected', clientId);

    sse.send({
        message: {
            text: 'HELLOOOOO!!!',
            id: nanoid(),
            senderId: clientId,
        } as Message,
        type: ServerSentEventType.MESSAGE,
        clientId,
    });

    setTimeout(() => {
        sse.send({
            message: {
                text: 'HELLOOOOO 5 sec later!!!',
                id: nanoid(),
                senderId: clientId,
            } as Message,
            type: ServerSentEventType.MESSAGE,
            clientId,
        });
    }, 5000);

    // console.log('global.processId', global.processId);

    res.on('close', () => {
        sse.disconnect(clientId);
    });
};

export default handler;
