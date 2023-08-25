import { resolve } from 'path'
import { createReadStream } from 'fs'
import dotenv from 'dotenv'
import mimeTypes from 'mime-types'
import { DeleteObjectCommand, HeadObjectCommand, S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { LocalFileSystem } from '../src/local'

dotenv.config()

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECREST_ACCESS_KEY
const bucketName = process.env.S3_BUCKET_NAME
const region = process.env.S3_REGION

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

  // s3 auth client
  const client = new S3({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  async function upload(key: string, pathToFile: string) {
    const head = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    try {
      await client.send(head)
      console.log(`Skipping "${key}"...`)
      // await client.send(
      //   new DeleteObjectCommand({ Bucket: bucketName, Key: key }),
      // )
      // console.log('Deleted', key)
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
      console.log(`Uploaded "${key}"!`)
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
        await upload(key, resolve(asset.path, path))
      }
    }
    console.log(assetPack.name, '✅')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
