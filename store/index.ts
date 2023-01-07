import { configureStore } from '@reduxjs/toolkit';
import popUpNotificationReducer from 'components/PopUpNotifications/slice';
import connectedStateReducer from 'components/ConnectionStatus/connectedState.slice';
import messagesReducer from 'app/messenger/messages.slice';
import { chatsApi } from 'service';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
    reducer: {
        notifications: popUpNotificationReducer,
        connectedState: connectedStateReducer,
        messages: messagesReducer,
        [chatsApi.reducerPath]: chatsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
