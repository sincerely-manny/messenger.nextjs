export const toHhMm = (timestamp: string | number | Date) => {
    const str = Date.parse(timestamp.toString());
    return new Date(str).toLocaleTimeString('ru-RU', { timeStyle: 'short' });
};

export default { toHhMm };
