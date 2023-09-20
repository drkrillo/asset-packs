import {  engine } from '@dcl/sdk/ecs'
import { name, version } from '../package.json'
import { actionsSystem } from './actions'
import { triggersSystem } from './triggers'

export function main() {
  console.log(`Using ${name}@${version}`)
  engine.addSystem(actionsSystem)
  engine.addSystem(triggersSystem)
}
