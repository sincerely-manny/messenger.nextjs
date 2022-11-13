import Rest from '../rest';

type Data = {
    name: string
};

class SignUp extends Rest<Data> {
    get = () => {
        this.response?.status(200).json({
            status: 'ok',
            payload: {
                name: 'JD',
            },
        });
    };
}

export default new SignUp().handler;
