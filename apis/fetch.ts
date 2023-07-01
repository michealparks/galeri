import { fetchJSON as fetchJSONBrowser } from '../src/lib/fetch'

export const fetchJSON = import.meta.ELECTRON ? globalThis.fetchJSON : fetchJSONBrowser
