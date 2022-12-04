import { nanoid } from '@reduxjs/toolkit';
import { NextApiResponse } from 'next';

type Clients = Map<string, NextApiResponse>;

export type ServerSentMessage = Record<string, unknown> | string;

export enum ServerSentEventType {
    MESSAGE,
    TYPING,
    PING,
}

class ServerSentEvents {
    private clients: Clients = new Map();

    public connect = (id: string, response: NextApiResponse) => {
        this.clients.set(id, response);
    };

    public disconnect = (id: string) => {
        this.clients.delete(id);
    };

    public send = (
        data: {
            message: ServerSentMessage,
            type: ServerSentEventType,
            clientId: string,
        },
    ) => {
        const { message, type, clientId } = data;
        const client = this.clients.get(clientId);
        if (client === undefined) {
            return false;
        }

        const stream = [
            `event: ${ServerSentEventType[type]}`,
            `data: ${JSON.stringify(message)}`,
            `id: ${nanoid()}`,
            'retry: 5000',
            '\n',
        ].join('\n');

        return client.write(stream);
    };
}

const sse = new ServerSentEvents();

export default sse;
