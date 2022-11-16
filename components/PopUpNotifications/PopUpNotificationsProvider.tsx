'use client';

import * as Toast from '@radix-ui/react-toast';
import { Provider } from 'react-redux';
import { store } from 'store';
import PopUpNotifications from './PopUpNotifications';

export default function PopUpNotificationsProvider() {
    return (
        <Provider store={store}>
            <Toast.Provider duration={99999999}>
                <PopUpNotifications />
            </Toast.Provider>
        </Provider>
    );
}
