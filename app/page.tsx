'use client';

import { addNotification } from 'components/PopUpNotifications';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(addNotification({
            message: 'Hello there!',
        }));
    };
    const session = useSession();
    console.log(session);
    return (
        <div>
            <button type="button" onClick={handleClick}>NOTIFY!</button>
        </div>
    );
};

export default withSessionProvider(withStoreProvider(Home));
