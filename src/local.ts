import { createDirectory, exists, readJson, writeFile } from './utils/fs'
import { slug } from './utils/string'
import { BuilderApiAsset, BuilderApiAssetPack } from './builder/types'
import { AssetData, AssetPackData, isAssetPack } from './types'

export class LocalFileSystem {
  constructor(public cwd: string) {}

  getAssetPackPath(assetPack: BuilderApiAssetPack) {
    return `${this.cwd}/${slug(assetPack.title)}`
  }

  async writeAssetPack(assetPack: BuilderApiAssetPack) {
    const assetPackPath = `${this.cwd}/${slug(assetPack.title)}`
    const alreadyExists = await exists(assetPackPath)
    if (!alreadyExists) {
      await createDirectory(assetPackPath)
    }
    const data: AssetPackData = {
      id: assetPack.id,
      name: assetPack.title,
    }
    await writeFile(`${assetPackPath}/data.json`, JSON.stringify(data, null, 2))
  }

  async getAssetPack(path: string) {
    const dataPath = `${path}/data.json`
    const data = await readJson(dataPath)
    if (!isAssetPack(data)) {
      throw new Error(`Invalid data in "${dataPath}"`)
    }
    return data
  }

  getAssetsPath(assetPack: BuilderApiAssetPack) {
    return `${this.getAssetPackPath(assetPack)}/assets`
  }

  getAssetPath(assetPack: BuilderApiAssetPack, asset: BuilderApiAsset) {
    return `${this.getAssetsPath(assetPack)}/${slug(asset.name)}`
  }

  async writeAsset(assetPack: BuilderApiAssetPack, asset: BuilderApiAsset) {
    const assetsPath = this.getAssetsPath(assetPack)
    await createDirectory(assetsPath)
    const baseAssetPath = this.getAssetPath(assetPack, asset)
    let assetPath = baseAssetPath
    let attempts = 1
    while (await exists(assetPath)) {
      assetPath = `${baseAssetPath}_${++attempts}`
    }
    const { id, name, category, model } = asset
    const data: AssetData = {
      id,
      name,
      category,
      components: {
        'core::GltfContainer': {
          src: `{assetPath}/${model}`,
        },
      },
    }
    await createDirectory(assetPath)
    await writeFile(`${assetPath}/data.json`, JSON.stringify(data, null, 2))
    return assetPath
  }
}
