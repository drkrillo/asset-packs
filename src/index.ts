import {  engine } from '@dcl/sdk/ecs'
import { name, version } from '../package.json'
import { actionsSystem } from './actions'
import { triggersSystem } from './triggers'
import { addActionTypes } from './definitions'

export function main() {
  console.log(`Using ${name}@${version}`)
  addActionTypes(engine)
  engine.addSystem(actionsSystem)
  engine.addSystem(triggersSystem)
}
