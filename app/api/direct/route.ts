import { revalidateTag } from 'next/cache'

// Control: revalidates before returning the response.
export async function POST() {
  revalidateTag('demo', 'max')
  return new Response('revalidated\n')
}
