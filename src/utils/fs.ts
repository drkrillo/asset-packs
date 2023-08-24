import fs from 'fs'
import future from 'fp-future'
import { resolve, dirname } from 'path'

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

export async function writeFile(path: string, data: string | Buffer) {
  const promise = future<void>()
  const dir = dirname(path)
  await createDirectory(dir)
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

export function isDirectory(path: string) {
  const promise = future<boolean>()
  fs.lstat(path, (err, stats) =>
    err ? promise.reject(err) : promise.resolve(stats.isDirectory()),
  )
  return promise
}

export function getSubfolders(path: string) {
  const promise = future<string[]>()
  fs.readdir(path, async (err, files) => {
    if (err) {
      promise.reject(err)
    } else {
      const results = await Promise.all(
        files.map(async (file) => {
          return {
            file,
            isDirectory: await isDirectory(resolve(path, file)),
          }
        }),
      )
      promise.resolve(
        results
          .filter((result) => result.isDirectory)
          .map((result) => resolve(path, result.file)),
      )
    }
  })
  return promise
}

export function move(from: string, to: string) {
  const promise = future<void>()
  fs.rename(from, to, (err) => (err ? promise.reject(err) : promise.resolve()))
  return promise
}