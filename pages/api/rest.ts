import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from './types';

export default abstract class Rest<PayloadType = undefined> {
    protected request?: NextApiRequest;

    protected response?: NextApiResponse<ApiResponse<PayloadType>>;

    public handler = (req: NextApiRequest, res: NextApiResponse<ApiResponse<PayloadType>>) => {
        this.request = req;
        this.response = res;
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
        this.response?.status(404).json({
            status: 'error',
            message: `Method ${this.request?.method || ''} is not implemented`,
        });
    };
}
