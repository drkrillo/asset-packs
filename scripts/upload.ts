import { S3 } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import { LocalFileSystem } from '../src/local'

dotenv.config()

async function main() {
  const client = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECREST_ACCESS_KEY!,
    },
  })

  const local = new LocalFileSystem('./assets')
  const assetPacks = await local.getAssetPacks()
  for (const assetPack of assetPacks) {
    const assetPackPath = local.getAssetsPath(assetPack.name)
    const assets = await local.getAssets(assetPackPath)
    for (const asset of assets) {
      console.log(asset.name, '✅')
    }
    console.log(assetPack.name, '✅')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
