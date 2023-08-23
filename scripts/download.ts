import { Api } from '../src/builder/api'
import path from 'path'
import { createDirectory, exists, writeFile } from '../src/utils/fs'
import { LocalFileSystem } from '../src/local'
import { rimraf } from 'rimraf'

async function main() {
  console.log('Creating dist directory...')
  const assets = path.resolve(__dirname, '..', 'assets')
  if (await exists(assets)) {
    await rimraf(assets)
  }
  await createDirectory(assets)

  const builder = new Api('https://builder-api.decentraland.org')
  const local = new LocalFileSystem(assets)

  console.log('Downloading asset packs...')
  const assetPacks = await builder.getAssetPacks()
  for (const assetPack of assetPacks) {
    console.log(`Writing asset pack "${assetPack.title}"...`)
    await local.writeAssetPack(assetPack)
    console.log(`Downloading thumbnail...`)
    const assetPackPath = local.getAssetPackPath(assetPack)
    const thumbnail = await builder.getThumbnail(assetPack.id)
    console.log(`Saving thumbnail...`)
    await writeFile(`${assetPackPath}/thumbnail.png`, thumbnail)
    for (const asset of assetPack.assets) {
      console.log(`Writing asset "${asset.name}"...`)
      const assetPath = await local.writeAsset(assetPack, asset)
      for (const path in asset.contents) {
        const hash = asset.contents[path]
        const content = await builder.getContent(hash)
        console.log(`Writing file "${path}"...`)
        await writeFile(`${assetPath}/${path}`, content)
        const thumbnail = await builder.getContent(asset.thumbnail)
        console.log(`Writing thumbnail for "${asset.name}"...`)
        await writeFile(`${assetPath}/thumbnail.png`, thumbnail)
      }
    }
  }
}

main().catch(console.error)
