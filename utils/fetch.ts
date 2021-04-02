import cp from 'child_process'
import { promisify } from 'util'

const exec = promisify(cp.exec)

type FetchOptions = {
  headers?: string
}

// Node's request lib is failing to parse the headers for met requests :|
// So for now we're just going to curl them.
const _fetch = async (input: string, opts: FetchOptions = {}) => {
  const cmd = `curl --compressed`
  const headersCmd = opts.headers === undefined ? '' : `-H "${opts.headers}"`
  const fullCmd = `${cmd} ${headersCmd} "${input}"`
  const { stdout, stderr } = await exec(fullCmd)
	return stdout
}

export const fetchJSON = async (input: string, opts: FetchOptions = {}): Promise<any> => {
  opts.headers = `${opts.headers || ''} -H "Content-Type: application/json" -H "Accept: application/json"`
  const stdout = await _fetch(input, opts)
	return JSON.parse(stdout)
}