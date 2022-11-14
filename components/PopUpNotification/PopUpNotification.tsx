'use client';

import { Provider } from 'react-redux';
import { store } from 'store';

export default function PopUpNotification() {
    return (
        <Provider store={store}>
            <div>HENLO!</div>
        </Provider>
    );
}
