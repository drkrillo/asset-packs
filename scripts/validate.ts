import { rimraf } from 'rimraf'
import { LocalFileSystem } from '../src/local'

async function main() {
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

main().catch(console.error)
