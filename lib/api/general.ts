export type ApiResponse<Payload = undefined> = {
    status: 'ok' | 'error',
    message?: string,
    payload?: Payload,
};

export type ApiResponseError = {
    status: 'error',
    message: string,
};

export enum StatusCode {
    Ok = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalError = 500,
    BadGateway = 502,
    Unavailable = 503,
}
