import {
  IEngine,
  createInputSystem,
  createPointerEventsSystem,
} from '@dcl/sdk/ecs'
import { createComponents, initComponents } from './definitions'
import { createActionsSystem } from './actions'
import { createTriggersSystem } from './triggers'
import { createTimerSystem } from './timer'
import { getExplorerComponents } from './components'
import { createTransformSystem } from './transform'
import { createInputActionSystem } from './input-actions'

let initialized: boolean = false
/**
 * the _args param is there to mantain backwards compatibility with all versions.
 * Before it was initAssetPacks(engine, pointerEventsSystem, components)
 */
export function initAssetPacks(_engine: unknown, ..._args: any[]) {
  // Avoid creating the same systems if asset-pack is called more than once
  if (initialized) return
  initialized = true
  // .

  const engine = _engine as IEngine
  try {
    const components = getExplorerComponents(engine)
    // create editor components
    createComponents(engine)

    // create core systems
    const inputSystem = createInputSystem(engine)
    const pointerEventsSystem = createPointerEventsSystem(engine, inputSystem)

    // create systems that some components needs (VideoPlayer, etc)
    initComponents(engine)
    engine.addSystem(createActionsSystem(engine))
    engine.addSystem(
      createTriggersSystem(engine, components, pointerEventsSystem),
    )
    engine.addSystem(createTimerSystem())
    engine.addSystem(createInputActionSystem(inputSystem))
    engine.addSystem(createTransformSystem(components))
  } catch (error) {
    console.error(`Error initializing Asset Packs: ${(error as Error).message}`)
  }
}
