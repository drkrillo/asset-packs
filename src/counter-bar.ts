import { IEngine } from '@dcl/sdk/ecs'
import { ComponentName } from './enums'
import { Components } from './definitions'

export function createCounterBarSystem(
  engine: IEngine,
  components: Components,
) {
  const { Counter, CounterBar } = components
  for (const [entity, { value }, { color }] of engine.getEntitiesWith(
    Counter,
    CounterBar,
  )) {
  }
  return null
}
