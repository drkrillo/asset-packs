import {  engine } from '@dcl/sdk/ecs'
import { actionsSystem } from './actions'
import { triggersSystem } from './triggers'

export function main() {
  engine.addSystem(actionsSystem)
  engine.addSystem(triggersSystem)
}
