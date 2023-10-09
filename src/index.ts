import {
  engine,
  pointerEventsSystem,
  Animator,
  Transform,
  AudioSource,
  AvatarAttach,
  VisibilityComponent,
  GltfContainer,
} from '@dcl/sdk/ecs'
import { initAssetPacks } from './scene-entrypoint'

initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  Transform,
  AudioSource,
  AvatarAttach,
  VisibilityComponent,
  GltfContainer,
})

export function main() {
  console.log('Scene ready')
}
