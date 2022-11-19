'use client';

import * as Toast from '@radix-ui/react-toast';
import withStoreProvider from 'components/withStoreProvider';
import PopUpNotifications from './PopUpNotifications';

const PopUpNotificationsProvider = () => (
    <Toast.Provider>
        <PopUpNotifications />
    </Toast.Provider>
);

export default withStoreProvider(PopUpNotificationsProvider);
