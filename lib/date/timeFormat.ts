export const toHhMm = (timestamp: string | number) => (
    new Date(typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp)
        .toLocaleTimeString('ru-RU', { timeStyle: 'short' })
);

export default { toHhMm };
