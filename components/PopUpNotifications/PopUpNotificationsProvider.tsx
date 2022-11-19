'use client';

import * as Toast from '@radix-ui/react-toast';
import { Provider } from 'react-redux';
import { store } from 'store';
import PopUpNotifications from './PopUpNotifications';

const PopUpNotificationsProvider = () => (
    <Provider store={store}>
        <Toast.Provider>
            <PopUpNotifications />
        </Toast.Provider>
    </Provider>
);

export default PopUpNotificationsProvider;
