import { IEngine, PointerEventsSystem } from '@dcl/sdk/ecs'
import { name, version } from '../package.json'
import { createComponents, initComponents } from './definitions'
import { createActionsSystem } from './actions'
import { createTriggersSystem } from './triggers'

export function initAssetPacks(
  _engine: any,
  _pointerEventsSystem: any,
  components: {
    Animator: any
    Transform: any
    AudioSource: any
    AvatarAttach: any
    VisibilityComponent: any
    GltfContainer: any
  },
) {
  const engine = _engine as IEngine
  const pointerEventsSystem = _pointerEventsSystem as PointerEventsSystem
  console.log(`Using ${name}@${version}`)
  try {
    createComponents(engine)
    engine.addSystem(createActionsSystem(engine, components))
    engine.addSystem(createTriggersSystem(engine, pointerEventsSystem))
    initComponents(engine)
  } catch (error) {
    console.error(`Error initializing Asset Packs: ${(error as Error).message}`)
  }
}
