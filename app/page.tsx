'use client';

import { addNotification } from 'components/PopUpNotifications';
import withStoreProvider from 'components/withStoreProvider';
import { useDispatch } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(addNotification({
            message: 'Hello there!',
        }));
    };
    return (
        <button type="button" onClick={handleClick}>NOTIFY!</button>
    );
};

export default withStoreProvider(Home);
