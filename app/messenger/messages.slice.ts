import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Message } from 'lib/api/message';

type Messages = {
    [key: string]: Message[],
};

export const initialState: Messages = {
    0: [
        {
            id: nanoid(),
            text: 'Shy pitiful gorgeous adorable crooked shrilling lemon icy umbrella.',
            senderId: nanoid(),
        },
        {
            id: nanoid(),
            text: 'Vast flat millions white magnificent yellow harsh bland eye.',
            senderId: nanoid(),
        },
        {
            id: nanoid(),
            text: 'Straight noisy huge arrogant loud itchy abiding apple.',
            senderId: nanoid(),
        },
        {
            id: nanoid(),
            text: 'Little shaggy careful cold millions slow delicious wailing cold dog.',
            senderId: nanoid(),
        },
        {
            id: nanoid(),
            text: 'Square melodic disgusting boring flat melodic sharp boy. ',
            senderId: nanoid(),
        },
        {
            id: nanoid(),
            text: 'Loose shallow white helpful powerful able raincoat.',
            senderId: nanoid(),
        },
    ],
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<Messages>) => {
            state = action.payload;
        },
        catchMessage: (state, action: PayloadAction<Message>) => {
            state[0].push(action.payload);
        },
    },
});

export const {
    setMessages,
    catchMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
