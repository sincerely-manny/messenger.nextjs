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
