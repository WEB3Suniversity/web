// 不要使用 NextResponse
export const runtime = 'edge'

export async function GET(request: Request) {
  const data = await request.json()
  return new Response(JSON.stringify({ message: 'Hello', data }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}

export async function POST(request: Request) {
  const data = await request.json()
  return new Response(JSON.stringify({ received: data }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}