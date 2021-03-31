
// @ts-ignore
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser

// @ts-ignore
import fetch from 'node-fetch'
// @ts-ignore
import { JSDOM } from 'jsdom'

// @ts-ignore
globalThis.DOMParser = class DOMParser {
	parseFromString (str: string, _format: string) {
		return new JSDOM(str).window.document
	}
}

// @ts-ignore
globalThis.fetch = fetch
