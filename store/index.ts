import { configureStore } from '@reduxjs/toolkit';
import popUpNotificationReducer from 'components/PopUpNotification/slice';

export const store = configureStore({
    reducer: {
        notifications: popUpNotificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
