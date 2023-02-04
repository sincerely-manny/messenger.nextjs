import { StatusCode } from 'lib/api/general';
import pusherConfig, {
    PusherAuthReq, PusherAuthRes, PUSHER_PRESENCE_CHANNEL_NAME, PUSHER_PRIVATE_CHANNEL_PREFIX,
} from 'lib/api/pusher';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Pusher from 'pusher';
import { authOptions } from '../auth/[...nextauth]';

// type AppKeyRes = {
//     appKey: string,
// };

// class PusherAuth extends Rest<PusherAuthReq, PusherAuthRes | ApiResponse<AppKeyRes>> {
//     // protected withAuth = { get: true, post: true };

//     post = async () => {
//     // post = () => {
//         const session = await this.checkSession();
//         // const session = await getServerSession(this.request, this.response, authOptions);
//         const { id } = session.user;
//         // const id = 'clb8porik0000rip3uppbqxgx';

//         const pusher = new Pusher(pusherConfig);

//         const user = {
//             id,
//             // user_info: session.user,
//             watchlist: ['another_id_1', 'another_id_2'],
//         };

//         const { socket_id: socketId, channel_name: channel } = this.request.body;

//         let authResponse: PusherAuthRes;
//         if (channel === undefined) {
//             authResponse = pusher.authenticateUser(socketId, user);
//         } else if (
//             channel === `${PUSHER_PRIVATE_CHANNEL_PREFIX}${id}`
//             || channel === PUSHER_PRESENCE_CHANNEL_NAME
//         ) {
//             authResponse = pusher.authorizeChannel(socketId, channel);
//         } else {
//             this.respond(
//                 StatusCode.Unauthorized,
//                 { status: 'error', message: 'No access to this channel' },
//             );
//             return;
//         }

//         this.respond(StatusCode.Ok, authResponse);
//     };

//     get = async () => {
//         const session = await this.checkSession();
//         if (!session) {
//             return;
//         }

//         const appKey = process.env.PUSHER_KEY;

//         if (appKey) {
//             this.respond(StatusCode.Ok, {
//                 status: 'ok',
//                 payload: {
//                     appKey,
//                 },
//             });

//             setInterval(() => {
//                 const pusher = new Pusher(pusherConfig);
//                 pusher.trigger(
//                     `${PUSHER_PRIVATE_CHANNEL_PREFIX}${session.user.id}`,
//                     'message',
//                     { test: Date.now().toString(), user: session.user },
//                 ).catch(() => {});
//             }, 5000);
//         } else {
//             this.respond(StatusCode.InternalError, {
//                 status: 'error',
//             });
//         }
//     };
// }

// export default new PusherAuth().handler;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return;
    }
    const { id } = session.user;
    if (req.method === 'POST') {
        const pusher = new Pusher(pusherConfig);

        const user = {
            id,
            user_info: session.user,
            watchlist: ['another_id_1', 'another_id_2'],
        };

        const { socket_id: socketId, channel_name: channel } = req.body as PusherAuthReq;

        let authResponse: PusherAuthRes;
        if (channel === undefined) {
            authResponse = pusher.authenticateUser(socketId, user);
        } else if (
            channel === `${PUSHER_PRIVATE_CHANNEL_PREFIX}${id}`
            || channel === PUSHER_PRESENCE_CHANNEL_NAME
        ) {
            authResponse = pusher.authorizeChannel(socketId, channel);
        } else {
            res.status(StatusCode.Unauthorized).json({ status: 'error', message: 'No access to this channel' });
            return;
        }

        res.status(StatusCode.Ok).json(authResponse);
    } else if (req.method === 'GET') {
        const appKey = process.env.PUSHER_KEY;

        if (appKey) {
            res.status(StatusCode.Ok).json({
                status: 'ok',
                payload: {
                    appKey,
                },
            });

            setTimeout(() => {
                const pusher = new Pusher(pusherConfig);
                pusher.trigger(`${PUSHER_PRIVATE_CHANNEL_PREFIX}${session.user.id}`, 'message', { test: Date.now().toString(), user: session.user }).catch(() => {});
            }, 5000);
        } else {
            res.status(StatusCode.InternalError).json({
                status: 'error',
            });
        }
    }
}
