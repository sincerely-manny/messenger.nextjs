import { Chat, User } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ChatsList = ({ users: User[] } & Chat)[];

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/chats/' }),
    endpoints: (builder) => ({
        getChatsList: builder.query<ChatsList, null>({
            query: () => 'list',
            transformResponse: (response: { payload: ChatsList }) => response.payload,
        }),
    }),
});

export const { useGetChatsListQuery } = chatsApi;

type ApiKeyResponse = { appKey: string };

export const pusherApi = createApi({
    reducerPath: 'pusherApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/messenger/' }),
    endpoints: (builder) => ({
        getPusherAppKey: builder.query<ApiKeyResponse, null>({
            query: () => 'pusher-auth',
            transformResponse: (
                response: { payload: ApiKeyResponse },
            ) => response.payload,
        }),
    }),
});

export const { useGetPusherAppKeyQuery } = pusherApi;
