import { nanoid } from '@reduxjs/toolkit';
import { NextApiRequest, NextApiResponse } from 'next';

type ActiveConnections = Map<string, {
    response: NextApiResponse,
    UserAgent: string,
    created: string,
}>;

type Clients = Map<string, ActiveConnections>;

export type ServerSentMessage = Record<string, unknown> | string;

export enum ServerSentEventType {
    MESSAGE,
    TYPING,
    PING,
    HANDSHAKE,
}

// Only works correctly in prod mode
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

    public connect = (id: string, response: NextApiResponse, headers: NextApiRequest['headers']) => {
        const connectionId = nanoid(5);
        const activeConnections = this.clients.get(id) || new Map() as ActiveConnections;
        activeConnections.set(connectionId, {
            response,
            UserAgent: headers['user-agent'] || 'Unknown',
            created: Date.now().toString(),
        });
        this.clients.set(id, activeConnections);
        return connectionId;
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

        if (client === undefined || !client.size) {
            return false;
        }

        const stream = [
            `event: ${ServerSentEventType[type]}`,
            `data: ${JSON.stringify(message)}`,
            `id: ${nanoid()}`,
            'retry: 10000',
            '\n',
        ].join('\n');

        // return client.write(stream);
        client.forEach((connection) => {
            connection.response.write(stream);
        });
        return true;
    };
}

export default ServerSentEvents;
