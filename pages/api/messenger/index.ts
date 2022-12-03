import { NextApiRequest, NextApiResponse } from 'next';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// curl -Nv localhost:3000/api/see
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    const clientId = Date.now();

    console.log(`${clientId} Connected`);

    for (let i = 0; i < 5; i++) {
        res.write(`data: Hello seq ${i} client: ${clientId}\n\n`);
        await sleep(1000);
    }
    // res.end('done\n');
    req.on('end', () => {
        console.log(`${clientId} Connection closed`);
    });
};

export default handler;
