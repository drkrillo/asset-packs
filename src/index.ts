import {
  engine,
  pointerEventsSystem,
  Animator,
  Transform,
  AudioSource,
  AvatarAttach,
  VisibilityComponent,
  GltfContainer,
  Material,
  VideoPlayer
} from '@dcl/sdk/ecs'
import { initAssetPacks } from './scene-entrypoint'

initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  Transform,
  AudioSource,
  AvatarAttach,
  VisibilityComponent,
  GltfContainer,
  Material,
  VideoPlayer
})

export function main() {
  console.log('Scene ready')
}
