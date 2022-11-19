import * as Toast from '@radix-ui/react-toast';
import { FiXCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'store/hooks';
import './PopUpNotifications.scss';
import { dismissNotification } from './slice';

const PopUpNotifications = () => {
    const notifications = useAppSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const openStateHandler = (id: string) => (isOpen: boolean) => {
        if (!isOpen) {
            dispatch(dismissNotification(id));
        }
    };
    return (
        <>
            {
                Object.entries(notifications).map(
                    ([id, { title, message, type }]) => (
                        <Toast.Root key={id} className={`pu-notification notification-${type || 'info'}`} onOpenChange={openStateHandler(id)}>
                            {title && <Toast.Title className="pu-notification-title">{title}</Toast.Title> }
                            <Toast.Description className="pu-notification-message">{message}</Toast.Description>
                            <Toast.Close className="pu-notification-close">
                                <FiXCircle size="25px" strokeWidth="1px" />
                            </Toast.Close>
                        </Toast.Root>
                    ),
                )
            }
            <Toast.Viewport className="notifications-viewport" />
        </>
    );
};

export default PopUpNotifications;
