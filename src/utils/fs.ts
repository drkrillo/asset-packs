import fs from 'fs'
import future from 'fp-future'

export function exists(path: string) {
  const promise = future<boolean>()
  fs.stat(path, (err) => {
    if (err == null) {
      promise.resolve(true)
    } else if (err.code === 'ENOENT') {
      promise.resolve(false)
    } else {
      promise.reject(new Error(err.code))
    }
  })
  return promise
}

export async function createDirectory(path: string) {
  if (await exists(path)) {
    return
  }
  const promise = future<void>()
  fs.mkdir(path, { recursive: true }, (err) =>
    err ? promise.reject(err) : promise.resolve(),
  )
  return promise
}

export function writeFile(path: string, data: string | Buffer) {
  const promise = future<void>()
  fs.writeFile(path, data, 'utf8', (err) =>
    err ? promise.reject(err) : promise.resolve(),
  )
  return promise
}

export async function readJson(path: string) {
  const promise = future<string>()
  fs.readFile(path, 'utf8', (err, data) =>
    err ? promise.reject(err) : promise.resolve(data),
  )
  const data = await promise
  return JSON.parse(data)
}

export function readBuffer(path: string) {
  const promise = future<Buffer>()
  fs.readFile(path, (err, data) =>
    err ? promise.reject(err) : promise.resolve(data),
  )
  return promise
}
