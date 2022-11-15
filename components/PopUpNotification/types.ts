export type PUNotification = {
    title: string,
    message: string,
    type: 'info' | 'error' | 'warning' | 'success',
};

export type NotificationsState = Map<string, PUNotification>;
