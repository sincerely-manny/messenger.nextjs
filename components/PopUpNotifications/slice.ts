import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NotificationsState, PUNotificationProps } from './types';

const initialState: NotificationsState = {};

export const popUpNotificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<PUNotificationProps>) => {
            const id = nanoid();
            state[id] = action.payload;
        },
        dismissNotification: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
        },
    },
});

export const {
    addNotification,
    dismissNotification,
} = popUpNotificationSlice.actions;

export default popUpNotificationSlice.reducer;
