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
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Vast flat millions white magnificent yellow harsh bland eye.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Straight noisy huge arrogant loud itchy abiding apple.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Little shaggy careful cold millions slow delicious wailing cold dog.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Square melodic disgusting boring flat melodic sharp boy. ',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Loose shallow white helpful powerful able raincoat.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Shy pitiful gorgeous adorable crooked shrilling lemon icy umbrella.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Vast flat millions white magnificent yellow harsh bland eye.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Straight noisy huge arrogant loud itchy abiding apple.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Little shaggy careful cold millions slow delicious wailing cold dog.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Square melodic disgusting boring flat melodic sharp boy. ',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Loose shallow white helpful powerful able raincoat.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Shy pitiful gorgeous adorable crooked shrilling lemon icy umbrella.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Vast flat millions white magnificent yellow harsh bland eye.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Straight noisy huge arrogant loud itchy abiding apple.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Little shaggy careful cold millions slow delicious wailing cold dog.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Square melodic disgusting boring flat melodic sharp boy. ',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Loose shallow white helpful powerful able raincoat.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Shy pitiful gorgeous adorable crooked shrilling lemon icy umbrella.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Vast flat millions white magnificent yellow harsh bland eye.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Straight noisy huge arrogant loud itchy abiding apple.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Little shaggy careful cold millions slow delicious wailing cold dog.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Square melodic disgusting boring flat melodic sharp boy. ',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
        },
        {
            id: nanoid(),
            text: 'Loose shallow white helpful powerful able raincoat.',
            senderId: nanoid(),
            timestamp: Date.now().toString(),
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
        appendMessage: (state, action: PayloadAction<Message>) => {
            state[0].push(action.payload);
        },
        prependMessages: (state, action: PayloadAction<{
            messages: Message[],
            chatId: number,
        }>) => {
            const { messages, chatId } = action.payload;
            state[chatId].unshift(...messages);
        },
        updateMessage: (state, action: PayloadAction<{
            message: Partial<Message>,
            messageIndex: number,
            chatId: number,
        }>) => {
            const { message, messageIndex, chatId } = action.payload;
            if (state[chatId][messageIndex]) {
                state[chatId][messageIndex] = Object.assign(state[chatId][messageIndex], message);
            }
        },
        updateOrAppendMessage: (state, action: PayloadAction<{
            message: Partial<Message> | Message,
            chatId: number,
        }>) => {
            const { message, chatId } = action.payload;
            const messageIndex = state[chatId].findIndex((e) => e.id === message.id);
            if (messageIndex === -1) {
                state[chatId].push(message as Message);
            } else {
                state[chatId][messageIndex] = Object.assign(state[chatId][messageIndex], message);
            }
        },
    },
});

export const {
    setMessages,
    appendMessage,
    prependMessages,
    updateMessage,
    updateOrAppendMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
