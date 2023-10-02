import { engine } from '@dcl/sdk/ecs'
import { createComponents } from './definitions'

export const { Actions, Triggers, States, Counter } = createComponents(engine)
