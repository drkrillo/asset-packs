import fs from 'fs'
import future from 'fp-future'
import path from 'path'

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

export async function createDirectory(_path: string) {
  if (await exists(_path)) {
    return
  }
  const promise = future<void>()
  fs.mkdir(_path, { recursive: true }, (err) =>
    err ? promise.reject(err) : promise.resolve(),
  )
  return promise
}

export async function writeFile(_path: string, data: string | Buffer) {
  const promise = future<void>()
  const dir = path.dirname(_path)
  await createDirectory(dir)
  fs.writeFile(_path, data, 'utf8', (err) =>
    err ? promise.reject(err) : promise.resolve(),
  )
  return promise
}

export async function readJson(_path: string) {
  const promise = future<string>()
  fs.readFile(_path, 'utf8', (err, data) =>
    err ? promise.reject(err) : promise.resolve(data),
  )
  const data = await promise
  return JSON.parse(data)
}

export function readBuffer(_path: string) {
  const promise = future<Buffer>()
  fs.readFile(_path, (err, data) =>
    err ? promise.reject(err) : promise.resolve(data),
  )
  return promise
}

export function isDirectory(_path: string) {
  const promise = future<boolean>()
  fs.lstat(_path, (err, stats) =>
    err ? promise.reject(err) : promise.resolve(stats.isDirectory()),
  )
  return promise
}

export function getSubfolders(_path: string) {
  const promise = future<string[]>()
  fs.readdir(_path, async (err, files) => {
    if (err) {
      promise.reject(err)
    } else {
      const results = await Promise.all(
        files.map(async (file) => {
          return {
            file,
            isDirectory: await isDirectory(path.resolve(_path, file)),
          }
        }),
      )
      promise.resolve(
        results
          .filter((result) => result.isDirectory)
          .map((result) => path.resolve(_path, result.file)),
      )
    }
  })
  return promise
}