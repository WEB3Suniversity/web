import { routes } from './routes.generated'

export interface Env {
    // 环境变量类型
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        try {
            const url = new URL(request.url)
            const pathname = url.pathname
            const method = request.method

            if (method === 'OPTIONS') {
                return new Response(null, { headers: corsHeaders })
            }

            if (pathname.startsWith('/api/')) {
                const routePath = pathname.slice(5).split('/')[0]
                // @ts-expect-error routes
                const routeModule = routes[routePath]

                if (routeModule && routeModule[method]) {
                    const response = await routeModule[method](request)

                    // 添加 CORS 头
                    const headers = new Headers(response.headers)
                    Object.entries(corsHeaders).forEach(([key, value]) => {
                        headers.set(key, value)
                    })

                    return new Response(response.body, {
                        status: response.status,
                        headers
                    })
                }

                return new Response('Method Not Allowed', {
                    status: 405,
                    headers: corsHeaders
                })
            }

            return new Response('Not Found', {
                status: 404,
                headers: corsHeaders
            })

        } catch (err) {
            console.error('Error:', err)
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders
            })
        }
    }
}