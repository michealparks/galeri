import os from 'node:os'
import cp from 'node:child_process'
import { promisify } from 'node:util'
import $ from 'cheerio'

const exec = promisify(cp.exec)

type FetchOptions = {
  headers?: string,
  output?: string,
}

// Node's request lib is failing to parse the headers for met requests :|
// So for now we're just going to curl them.
const fetch = async (input: string, options: FetchOptions = {}) => {
  // Windows curl doesn't currently support --compressed :|
  const cmd = `curl ${os.platform() === 'win32' ? '' : '--compressed'}`
  const headersCmd = options.headers === undefined ? '' : `-H "${options.headers}"`
  const output = options.output ? `--output "${options.output}"` : ''
  const fullCmd = `${cmd} ${headersCmd} "${input}" ${output}`
  const { stdout, stderr } = await exec(fullCmd)
	return stdout
}

const fetchJSON = async (input: string, options: FetchOptions = {}): Promise<any> => {
  options.headers = `${options.headers || ''} -H "Content-Type: application/json" -H "Accept: application/json"`
  const stdout = await fetch(input, options)
	return JSON.parse(stdout)
}

globalThis.$ = $
globalThis.fetch = fetch
globalThis.fetchJSON = fetchJSON
