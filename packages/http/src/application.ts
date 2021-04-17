import { createServer, RequestListener } from 'http'
import { runWithAls, useInject, useMutation } from './hooks'

export function createApp() {
    return new Application();
}

class Application {
    middlewares: any[]
    constructor() {
        this.middlewares = []
    }

    listen(...args) {
        const server = createServer(this.createHandler())
        server.listen(...args)
        return server
    }

    private createHandler(): RequestListener {
        const { middlewares } = this
        return async (req, res) => {
            const result = await runWithAls(
                {
                    req,
                    res,
                    middlewares,
                    index: -1,
                },
                async function compose() {
                    const index = useInject<number>('index')
                    const middlewares = useInject<any[]>('middlewares')
                    const lenth = middlewares.length
                    if (index >= middlewares.length) {
                        useMutation<string>('body', 'Not Found')
                    }
                    useMutation<number>('index', index + 1)
                    const mw = middlewares[index + 1];
                    await mw()
                    const body = useInject('body');
                    if (body) {
                        return body
                    } else {
                        return compose()
                    }
                }, 
                []
            )
            if (typeof result === 'string') {
                res.end(result)
            }

            res.end(JSON.stringify(result))
        }
    }

    use(fn: () => unknown): void {
        this.middlewares.push(fn)
    }
}