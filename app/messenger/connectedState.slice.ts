import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const connectedState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
};

type ConnectedState = typeof connectedState[keyof typeof connectedState];

export const initialState: ConnectedState = connectedState.CLOSED;

export const connectedStateSlice = createSlice({
    name: 'connectedState',
    initialState,
    reducers: {
        setConnectedState: (state, action: PayloadAction<ConnectedState>) => {
            state = action.payload;
            return action.payload;
        },
    },
});

export const {
    setConnectedState,
} = connectedStateSlice.actions;

export default connectedStateSlice.reducer;
