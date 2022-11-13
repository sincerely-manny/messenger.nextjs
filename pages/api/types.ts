export type ApiResponse<Payload = undefined> = {
    status: 'ok' | 'error',
    message?: string,
    payload?: Payload,
};
