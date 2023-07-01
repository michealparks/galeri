import os from 'os'
import cp from 'child_process'
import { promisify } from 'util'
import { reportError } from './util'

const exec = promisify(cp.exec)

type FetchOptions = {
	headers?: string,
	output?: string,
}

// Node's request lib is failing to parse the headers for met requests :|
// So for now we're just going to curl them.
export const fetch = async (input: string, opts: FetchOptions = {}): Promise<string> => {
	// Windows curl doesn't currently support --compressed :|
	const cmd = `curl ${os.platform() === 'win32' ? '' : '--compressed'}`
	const headersCmd = opts.headers === undefined ? '' : `-H "${opts.headers}"`
	const output = opts.output ? `--output "${opts.output}"` : ''
	const fullCmd = `${cmd} ${headersCmd} "${input}" ${output}`

	try {
		const { stdout, stderr } = await exec(fullCmd)
	
		if (stderr) {
			reportError('fetch(): ', stderr)
		}

		return stdout
	} catch (error) {
		reportError('fetch(): ', error)
	}

	return ''
}

export const fetchJSON = async (input: string, opts: FetchOptions = {}): Promise<unknown> => {
	opts.headers = `${opts.headers || ''} -H "Content-Type: application/json" -H "Accept: application/json"`
	const stdout = await fetch(input, opts)
	return JSON.parse(stdout)
}

globalThis.fetch = fetch
globalThis.fetchJSON = fetchJSON
