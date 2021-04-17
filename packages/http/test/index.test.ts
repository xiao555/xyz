import type { IncomingMessage } from 'node:http';
import { createApp, useInject, useMutation } from '../src'

const http = createApp();

http.use(() => {
    const req = useInject<IncomingMessage>('req');
    useMutation('body', {
        code: 200,
        data: {
            url: req.url
        }
    })
})

http.use(() => {
    useMutation('body', {
        code: 404
    })
})

http.listen(8080, () => {
    console.log('xyz server run at http://localhost:8080');
})