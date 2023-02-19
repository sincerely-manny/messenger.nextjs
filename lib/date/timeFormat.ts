export const toHhMm = (timestamp: string | number) => {
    const str = Date.parse(timestamp.toString());
    return new Date(str).toLocaleTimeString('ru-RU', { timeStyle: 'short' });
};

export default { toHhMm };
