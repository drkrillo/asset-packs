import { resolve } from 'path'
import { createReadStream } from 'fs'
import dotenv from 'dotenv'
import mimeTypes from 'mime-types'
import { HeadObjectCommand, S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { LocalFileSystem } from '../src/local'

dotenv.config()
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECREST_ACCESS_KEY
const bucketName = process.env.S3_BUCKET_NAME
const region = process.env.S3_REGION
const concurrency = parseInt(process.env.S3_UPLOAD_CONCURRENCY || '')

async function main() {
  // validate env vars
  if (!accessKeyId) {
    throw new Error(`Missing AWS_ACCESS_KEY_ID env var`)
  }
  if (!secretAccessKey) {
    throw new Error(`Missing AWS_SECREST_ACCESS_KEY env var`)
  }
  if (!bucketName) {
    throw new Error(`Missing S3_BUCKET_NAME env var`)
  }
  if (!region) {
    throw new Error(`Missing S3_REGION env var`)
  }
  if (isNaN(concurrency)) {
    throw new Error(`Missing S3_UPLOAD_CONCURRENCY env var`)
  }

  console.log('Bucket Name:', bucketName)
  console.log('Region:', region)
  console.log('Concurrency:', concurrency)
  console.log('\n')

  // s3 auth client
  const client = new S3({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  // upload queue
  const { default: Queue } = await import('p-queue')
  const queue = new Queue({ concurrency: Math.max(concurrency, 1) })
  queue.on('error', (error) => {
    queue.pause()
    throw error
  })

  async function upload(key: string, pathToFile: string) {
    const head = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    try {
      await client.send(head)
      console.log(`Skipping "${key}"`)
    } catch (error) {
      const mimeType =
        mimeTypes.lookup(pathToFile) || 'application/octet-stream'
      const upload = new Upload({
        client,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: createReadStream(pathToFile),
          ContentType: mimeType,
          CacheControl: 'max-age=31536000, immutable',
        },
      })
      await upload.done()
      console.log(`Uploaded "${key}"`)
    }
  }

  const local = new LocalFileSystem('./assets')
  const assetPacks = await local.getAssetPacks()
  for (const assetPack of assetPacks) {
    const assetPackPath = local.getAssetsPath(assetPack.name)
    const assets = await local.getAssets(assetPackPath)
    for (const asset of assets) {
      for (const path in asset.contents) {
        const hash = asset.contents[path]
        const key = `contents/${hash}`
        queue.add(() => upload(key, resolve(asset.path, path)))
      }
    }
    await queue.onIdle()
    console.log(`Upload of "${assetPack.name}" is complete ✅`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
