import { Entity, IEngine } from '@dcl/sdk/ecs'
import { getNextId, requiresId } from './id'
import { isLastWriteWinComponent } from './lww'
import { TriggersComponent } from './definitions'

export function clone(
  entity: Entity,
  engine: IEngine,
  Triggers: TriggersComponent,
) {
  const cloned = engine.addEntity()

  // map ids
  const newIds = new Map<number, number>()
  debugger
  for (const component of engine.componentsIter()) {
    if (component.has(entity)) {
      let newValue = JSON.parse(JSON.stringify(component.get(entity)))
      if (requiresId(component)) {
        component
        const oldId = newValue.id
        const newId = getNextId(engine)
        newIds.set(oldId, newId)
        newValue = {
          ...newValue,
          id: newId,
        }
      }
      if (isLastWriteWinComponent(component)) {
        component.createOrReplace(cloned, newValue)
      }
    }
  }

  // if the entity has triggers, remap the old ids in the actions and conditions to the new ones
  if (Triggers.has(cloned)) {
    const triggers = Triggers.getMutable(cloned)
    for (const trigger of triggers.value) {
      for (const action of trigger.actions) {
        if (action.id) {
          const newId = newIds.get(action.id)
          if (newId) {
            action.id = newId
          }
        }
      }
      if (trigger.conditions) {
        for (const condition of trigger.conditions) {
          if (condition.id) {
            const newId = newIds.get(condition.id)
            if (newId) {
              condition.id = newId
            }
          }
        }
      }
    }
  }

  return cloned
}
