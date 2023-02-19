import { StatusCode } from 'lib/api/general';
import {
    PusherAuthReq,
    PusherAuthRes,
    pusherConfig,
    PUSHER_PRESENCE_CHANNEL_NAME,
    PUSHER_PRIVATE_CHANNEL_PREFIX,
} from 'lib/api/pusher';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Pusher from 'pusher';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return;
    }
    const { id } = session.user;
    const pusher = new Pusher(pusherConfig);
    const appKey = process.env.PUSHER_KEY;

    if (req.method === 'POST') {
        const { socket_id: socketId, channel_name: channel } = req.body as PusherAuthReq;
        let authResponse: PusherAuthRes;

        if (channel === undefined) {
            authResponse = pusher.authenticateUser(socketId, {
                id,
                user_info: session.user,
                watchlist: [id],
            });
        } else if (channel === `${PUSHER_PRIVATE_CHANNEL_PREFIX}${id}`) {
            authResponse = pusher.authorizeChannel(socketId, channel);
        } else if (channel === PUSHER_PRESENCE_CHANNEL_NAME) {
            authResponse = pusher.authorizeChannel(socketId, PUSHER_PRESENCE_CHANNEL_NAME, {
                user_id: id,
                user_info: session.user,
            });
        } else {
            res.status(StatusCode.Unauthorized).json({
                status: 'error',
                message: 'No access to this channel',
            });
            return;
        }
        res.status(StatusCode.Ok).json(authResponse);
    } else if (req.method === 'GET') {
        if (appKey) {
            res.status(StatusCode.Ok).json({
                status: 'ok',
                payload: {
                    appKey,
                },
            });
        } else {
            res.status(StatusCode.InternalError).json({
                status: 'error',
            });
        }
    }
}
