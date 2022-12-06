import { nanoid } from '@reduxjs/toolkit';
import { StatusCode } from 'lib/api/general';
import { Message } from 'lib/api/message';
import sse, { ServerSentEventType } from 'lib/sse/serverSentEvents';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// curl -Nv localhost:3000/api/see
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    const session = await unstable_getServerSession(req, res, authOptions);
    if (session === null) {
        res.status(StatusCode.Unauthorized);
        res.end('Unauthorized\n');
        return;
    }

    const clientId = session.user.id;

    sse.connect(clientId, res);

    // console.log(`${clientId} Connected`); // TODO: Check for double connection

    res.on('close', () => {
        sse.disconnect(clientId);
        // console.log(`${clientId} Connection closed`);
    });

    sse.send({
        message: {
            text: 'HELLOOOOO!!!',
            id: nanoid(),
            senderId: clientId,
        } as Message,
        type: ServerSentEventType.MESSAGE,
        clientId,
    });
};

export default handler;
