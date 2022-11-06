/// <reference types="svelte" />
/// <reference types="vite/client" />

import type { CheerioAPI } from "cheerio"

interface FetchOptions {
  headers?: string,
  output?: string,
}

declare global {
  const fetchJSON: (input: RequestInfo | string, init?: RequestInit) => Promise<Response>
  const fetch: (input: RequestInfo | string, options: FetchOptions = {}) => string
  const $: CheerioAPI
}
