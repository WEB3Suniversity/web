export const runtime = 'edge'

export async function GET() {
    return new Response(
        JSON.stringify({ message: 'Hello John Doe' }), 
        { headers: { 'Content-Type': 'application/json' } }
    )
}

export async function POST(request: Request) {
    const data = await request.json()
    return new Response(
        JSON.stringify({ received: data }), 
        { headers: { 'Content-Type': 'application/json' } }
    )
}