import {
  IEngine,
  LastWriteWinElementSetComponentDefinition,
} from '@dcl/sdk/ecs'
import { ComponentName, Counter } from './definitions'

export function getCounterComponent(engine: IEngine) {
  return engine.getComponent(
    ComponentName.COUNTER,
  ) as LastWriteWinElementSetComponentDefinition<Counter>
}

export function getNextId(engine: IEngine) {
  const Counter = getCounterComponent(engine)
  const counter = Counter.getOrCreateMutable(engine.RootEntity)
  return ++counter.value
}
