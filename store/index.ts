import { configureStore } from '@reduxjs/toolkit';
import popUpNotificationReducer from 'components/PopUpNotifications/slice';
import connectedStateReducer from 'app/messenger/connectedState.slice';

export const store = configureStore({
    reducer: {
        notifications: popUpNotificationReducer,
        connectedState: connectedStateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
