import { NextApiRequest, NextApiResponse } from 'next';

// curl -Nv localhost:3000/api/sse
const handler = (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    for (let i = 0; i < 5; i++) {
        res.write(`data: Hello seq ${i}\n\n`);
    }
    // res.end('done\n');
};

export default handler;
