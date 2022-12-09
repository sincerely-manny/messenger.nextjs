import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
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

    public checkSession = async () => {
        const session = await unstable_getServerSession(this.request, this.response, authOptions);
        if (session === null) {
            this.respond(StatusCode.Unauthorized, {
                status: 'error',
                message: 'Authorization required',
            });
            throw new Error('Authorization required');
        }
        return session;
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
