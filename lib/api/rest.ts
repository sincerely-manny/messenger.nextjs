import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, ApiResponseError, StatusCode } from './general';

type Q = Partial<{ [key: string]: string | string[]; }>;

interface NextApiRequestExtended<RequestBodyType, QueryType extends Q> extends NextApiRequest {
    body: RequestBodyType,
    query: QueryType,
}

export default abstract class Rest<
    RequestBodyType = undefined,
    ResponseBodyType extends ApiResponse<unknown> = ApiResponse<undefined>,
    QueryType extends Q = Record<string, never>,
> {
    protected request!: NextApiRequestExtended<RequestBodyType, QueryType>;

    protected response!: NextApiResponse<ResponseBodyType | ApiResponseError>;

    protected query?: typeof this.request.query;

    public handler = (
        req: typeof this.request,
        res: typeof this.response,
    ) => {
        this.request = req;
        this.response = res;
        this.query = req.query;
        if (this.request.method === 'GET') {
            this.get();
            return;
        }
        if (this.request.method === 'POST') {
            this.post();
            return;
        }
        if (this.request.method === 'PUT') {
            this.put();
            return;
        }
        if (this.request.method === 'DELETE') {
            this.delete();
        }
    };

    protected respond = (code: StatusCode, responseData: ResponseBodyType | ApiResponseError) => {
        this.response.status(code).json(responseData);
    };

    protected get = () => {
        this.notImplenented();
    };

    protected post = () => {
        this.notImplenented();
    };

    protected put = () => {
        this.notImplenented();
    };

    protected delete = () => {
        this.notImplenented();
    };

    private notImplenented = () => {
        this.respond(StatusCode.NotFound, {
            status: 'error',
            message: `Method ${this.request?.method || ''} is not implemented`,
        });
    };
}
