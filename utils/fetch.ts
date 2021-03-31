
const timeout = (time: number): Promise<undefined> => {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject()
    }, time)
  })
}

const _fetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
  const response = await Promise.race([
    timeout(20000),
    globalThis.fetch(input, init)
  ])

  if (response === undefined) {
    throw new Error(`${input} - timeout`)
  } else if (response.ok) {
    return response
  } else {
    const text = await response.text()
    throw new Error(`${input} - ${response.status} - ${text}`)
  }
}

export const fetchJSON = async (input: RequestInfo, init?: RequestInit | undefined): Promise<any> => {
  const response = await _fetch(input, init)
  return response.json()
}

export const fetchBlob = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Blob> => {
  const response = await _fetch(input, init)
  return response.blob()
}

export const fetchArrayBuffer = async (input: RequestInfo, init?: RequestInit | undefined): Promise<ArrayBuffer> => {
  const response = await _fetch(input, init)
  return response.arrayBuffer()
}
