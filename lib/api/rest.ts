import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ApiResponse, ApiResponseError, StatusCode } from './general';
import { PusherAuthRes } from './pusher';

type Q = Partial<{ [key: string]: string | string[]; }>;

interface NextApiRequestExtended<RequestBodyType, QueryType extends Q> extends NextApiRequest {
    body: RequestBodyType,
    query: QueryType,
}

export default abstract class Rest<
    RequestBodyType = undefined,
    ResponseBodyType extends ApiResponse<unknown> | PusherAuthRes
    = ApiResponse<undefined>,
    QueryType extends Q = Record<string, never>,
> {
    protected request!: NextApiRequestExtended<RequestBodyType, QueryType>;

    protected response!:
    NextApiResponse<ResponseBodyType | ApiResponseError | PusherAuthRes>;

    protected query?: typeof this.request.query;

    protected withAuth: Partial<{
        GET: boolean,
        POST: boolean,
        PUT: boolean,
        DELETE: boolean,
    }> = {};

    public handler = async (
        req: typeof this.request,
        res: typeof this.response,
    ) => {
        this.request = req;
        this.response = res;
        this.query = req.query;
        if (this.request.method === 'GET' && this.request.headers.accept === 'text/event-stream') {
            // this.response.setHeader('Access-Control-Allow-Origin', '*');
            this.response.setHeader('Connection', 'keep-alive');
            this.response.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
            this.response.setHeader('Content-Encoding', 'none');
            this.response.setHeader('Cache-Control', 'no-cache, no-transform');
            this.response.setHeader('X-Accel-Buffering', 'no');
            this.response.status(StatusCode.Ok);
            this.eventStream();
            return;
        }
        if (
            this.request.method
            && this.withAuth[this.request.method as keyof typeof this.withAuth] === true
        ) {
            const session = await this.checkSession();
            if (!session) {
                return;
            }
        }
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

    protected respond = (
        code: StatusCode,
        responseData: ResponseBodyType | ApiResponseError | PusherAuthRes,
    ) => {
        this.response.status(code).json(responseData);
    };

    public checkSession = async () => {
        const session = await getServerSession(this.request, this.response, authOptions);
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

    protected eventStream = () => {
        this.notImplenented();
    };

    private notImplenented = () => {
        this.respond(StatusCode.NotFound, {
            status: 'error',
            message: `Method ${this.request?.method || ''} is not implemented`,
        });
        this.response.end();
    };
}
