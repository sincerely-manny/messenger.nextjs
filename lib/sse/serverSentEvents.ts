import { nanoid } from '@reduxjs/toolkit';
import { NextApiResponse } from 'next';

type Clients = Map<string, NextApiResponse>;

export type ServerSentMessage = Record<string, unknown> | string;

export enum ServerSentEventType {
    MESSAGE,
    TYPING,
    PING,
}

// TODO: Returns the right instance of class only after page refresh (second connection). WTF????
// Caching?!?!?!
class ServerSentEvents {
    private static instance: ServerSentEvents;

    private clients: Clients;

    public id: string;

    private constructor() {
        this.clients = new Map();
        this.id = nanoid();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ServerSentEvents();
        return this.instance;
    }

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

        console.log(this.id, this.clients.keys());

        if (client === undefined) {
            return false;
        }

        const stream = [
            `event: ${ServerSentEventType[type]}`,
            `data: ${JSON.stringify(message)}`,
            `id: ${nanoid()}`,
            'retry: 10000',
            '\n',
        ].join('\n');

        return client.write(stream);
    };
}

export default ServerSentEvents;
