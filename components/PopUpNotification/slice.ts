import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NotificationsState, PUNotification } from './types';

const initialState: NotificationsState = new Map();

export const popUpNotificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<PUNotification>) => {
            const id = nanoid();
            state.set(id, action.payload);
        },
        dismissNotification: (state, action: PayloadAction<string>) => {
            state.delete(action.payload);
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    addNotification,
} = popUpNotificationSlice.actions;

export default popUpNotificationSlice.reducer;
