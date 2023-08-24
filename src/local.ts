import {
  createDirectory,
  exists,
  getSubfolders,
  readJson,
  writeFile,
} from './utils/fs'
import { slug } from './utils/string'
import { BuilderApiAsset, BuilderApiAssetPack } from './builder/types'
import { AssetData, AssetPackData, isAsset, isAssetPack } from './types'

export class LocalFileSystem {
  constructor(public cwd: string) {}

  getAssetPackPath(assetPackName: string) {
    return `${this.cwd}/${slug(assetPackName)}`
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

  getAssetsPath(assetPackName: string) {
    return `${this.getAssetPackPath(assetPackName)}/assets`
  }

  getAssetPath(assetPackName: string, assetName: string) {
    return `${this.getAssetsPath(assetPackName)}/${slug(assetName)}`
  }

  async getAsset(path: string) {
    const dataPath = `${path}/data.json`
    const data = await readJson(dataPath)
    if (!isAsset(data)) {
      throw new Error(`Invalid data in "${dataPath}"`)
    }
    const isSmart = await exists(`${path}/bin/game.js`)
    return { ...data, isSmart }
  }

  async isTaken(path: string, asset: BuilderApiAsset) {
    const alreadyExists = await exists(path)
    if (!alreadyExists) {
      return false
    }
    try {
      const data = await this.getAsset(path)
      return data.id !== asset.id
    } catch (error) {
      return true
    }
  }

  async getAvailableAssetPath(
    assetPack: BuilderApiAssetPack,
    asset: BuilderApiAsset,
  ) {
    const baseAssetPath = this.getAssetPath(assetPack.title, asset.name)
    let assetPath = baseAssetPath
    let attempts = 1
    while (await this.isTaken(assetPath, asset)) {
      assetPath = `${baseAssetPath}_${++attempts}`
    }
    return assetPath
  }

  async writeAsset(assetPack: BuilderApiAssetPack, asset: BuilderApiAsset) {
    const assetsPath = this.getAssetsPath(assetPack.title)
    await createDirectory(assetsPath)
    const assetPath = await this.getAvailableAssetPath(assetPack, asset)
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

  async getAssetPacks() {
    const folders = await getSubfolders(this.cwd)
    return Promise.all(folders.map(this.getAssetPack))
  }

  async getAssets(_path: string) {
    const folders = await getSubfolders(_path)
    return Promise.all(
      folders.map((folder) =>
        this.getAsset(folder).catch(() => {
          throw new Error(`Invalid asset at ${folder}`)
        }),
      ),
    )
  }
}
