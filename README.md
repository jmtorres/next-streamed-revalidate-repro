# next-streamed-revalidate-repro

`revalidateTag` called while a Route Handler's response body is streaming is never applied.

## Files

- `app/page.tsx`: a `'use cache'` component tagged `demo` that renders a timestamp captured inside the cache scope.
- `app/api/direct/route.ts`: `POST` calls `revalidateTag('demo', 'max')`, then returns. This is the control.
- `app/api/stream/route.ts`: `POST` returns a streamed `Response`. About 100 ms later the stream calls `revalidateTag('demo', 'max')` and closes.

## Steps

```sh
pnpm install
pnpm build
pnpm start   # http://localhost:3000
```

1. Load `/` twice. The timestamp is the same both times, because the page is cached.
2. Run `curl -X POST localhost:3000/api/stream`. It prints `started`, then `revalidated`.
3. Reload `/` a few times. **The timestamp never changes.**
4. Run `curl -X POST localhost:3000/api/direct`, then reload `/` twice. The timestamp changes. `'max'` is stale-while-revalidate, so the first reload still serves the old page.

## Observed

| Next | `/api/stream` then reloads | `/api/direct` then reloads |
|---|---|---|
| 16.3.8 (published, latest stable, Turbopack) | stale | fresh on the 2nd reload |
| 16.3.3 (published, Turbopack) | stale | fresh on the 2nd reload |
| 16.4.0-canary.54, local build, webpack | stale | fresh on the 2nd reload |
| 16.4.0-canary.54 + route-handler fix, local build, webpack | fresh on the 2nd reload | fresh on the 2nd reload |

## `next info`

```
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 25.6.0: Fri Jul 31 19:18:48 PDT 2026; root:xnu-12377.161.14~5/RELEASE_ARM64_T6020
  Available memory (MB): 98304
  Available CPU cores: 12
Binaries:
  Node: 26.7.0
  npm: 11.19.0
  Yarn: 1.22.22
  pnpm: 11.23.0
Relevant Packages:
  next: 16.3.8 // Latest available version is detected (16.3.8).
  eslint-config-next: N/A
  react: 19.2.7
  react-dom: 19.2.7
  typescript: 5.9.3
Next.js Config:
  output: N/A
```
