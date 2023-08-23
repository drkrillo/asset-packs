export type AssetPackData = {
  id: string
  name: string
}

export function isAssetPack(value: any): value is AssetPackData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  )
}

export type AssetData = {
  id: string
  name: string
  category: string
  components: Record<string, any>
}

export function isAsset(value: any): value is AssetData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.components === 'object' &&
    value.components !== null
  )
}
