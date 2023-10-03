import {  engine } from '@dcl/sdk/ecs'
import { name, version } from '../package.json'
import { actionsSystem } from './actions'
import { triggersSystem } from './triggers'
import { initComponents } from './definitions'

export function main() {
  console.log(`Using ${name}@${version}`)
  initComponents(engine)
  engine.addSystem(actionsSystem)
  engine.addSystem(triggersSystem)
}
