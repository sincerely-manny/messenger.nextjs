import { Chat } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from 'lib/api/general';

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/chats/' }),
    endpoints: (builder) => ({
        getChatsList: builder.query<ApiResponse<Chat[]>, null>({
            query: () => 'list',
        }),
    }),
});

export const { useGetChatsListQuery } = chatsApi;
