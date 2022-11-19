export type PUNotificationProps = {
    title?: string,
    message: string,
    type?: 'info' | 'error' | 'warning' | 'success',
};

export type NotificationsState = Record<string, PUNotificationProps>;
