import { cacheLife, cacheTag } from 'next/cache'

async function CachedTimestamp() {
  'use cache'
  cacheTag('demo')
  cacheLife('max')
  // Captured inside the cache scope, so it only changes when 'demo' is revalidated.
  return <p id="timestamp">{new Date().toISOString()}</p>
}

export default function Page() {
  return <CachedTimestamp />
}
