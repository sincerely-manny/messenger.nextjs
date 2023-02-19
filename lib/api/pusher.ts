import Pusher from 'pusher';

export const pusherConfig = {
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.PUSHER_CLUSTER || '',
    useTLS: true,
    encryptionMasterKeyBase64: process.env.PUSHER_MASTER_KEY,
};

export type PusherAuthReq = {
    socket_id: string;
    channel_name?: string;
};

export type PusherAuthRes = Pusher.UserAuthResponse | Pusher.ChannelAuthResponse;

export const PUSHER_PRIVATE_CHANNEL_PREFIX = 'private-';
export const PUSHER_PRESENCE_CHANNEL_NAME = 'presence-ch-global';
export const PUSHER_AUTH_ENDPOINT = '/api/messenger/pusher-auth';
