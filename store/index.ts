import { configureStore } from '@reduxjs/toolkit';
import popUpNotificationReducer from 'components/PopUpNotifications/slice';
import connectedStateReducer from 'components/ConnectionStatus/connectedState.slice';
import { chatsApi, pusherApi } from 'service';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
    reducer: {
        notifications: popUpNotificationReducer,
        connectedState: connectedStateReducer,
        [chatsApi.reducerPath]: chatsApi.reducer,
        [pusherApi.reducerPath]: pusherApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(chatsApi.middleware, pusherApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
