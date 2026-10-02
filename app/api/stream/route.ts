import { revalidateTag } from 'next/cache'

// Returns a streamed response first, then revalidates while the body streams
// (the shape of an MCP tool call on the Streamable HTTP transport).
export async function POST() {
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('started\n'))
      setTimeout(() => {
        revalidateTag('demo', 'max')
        controller.enqueue(encoder.encode('revalidated\n'))
        controller.close()
      }, 100)
    },
  })

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
