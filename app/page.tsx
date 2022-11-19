'use client';

import { addNotification } from 'components/PopUpNotifications';
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

export default Home;
