import { IEngine, PointerEventsSystem } from '@dcl/sdk/ecs'
import {
  EngineComponents,
  createComponents,
  initComponents,
} from './definitions'
import { createActionsSystem } from './actions'
import { createTriggersSystem } from './triggers'
import { createTimerSystem } from './timer'

export function initAssetPacks(
  _engine: any,
  _pointerEventsSystem: any,
  _components: Record<keyof EngineComponents, any>,
) {
  const engine = _engine as IEngine
  const pointerEventsSystem = _pointerEventsSystem as PointerEventsSystem
  const components = _components as EngineComponents
  try {
    createComponents(engine)
    engine.addSystem(createActionsSystem(engine, components))
    engine.addSystem(createTriggersSystem(engine, pointerEventsSystem))
    engine.addSystem(createTimerSystem())
    initComponents(engine, components)
  } catch (error) {
    console.error(`Error initializing Asset Packs: ${(error as Error).message}`)
  }
}
