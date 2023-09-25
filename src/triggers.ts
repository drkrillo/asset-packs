import { engine, Entity, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { Actions, States, Triggers } from './components'
import {
  Action,
  Trigger,
  TriggerCondition,
  TriggerConditionOperation,
  TriggerConditionType,
  TriggerType,
} from './definitions'
import { getCurrentValue } from './states'
import { getActionEvents, getTriggerEvents } from './events'
import { getPayload } from './action-types'

const initedEntities = new Set<Entity>()
const actionQueue: { entity: Entity; action: Action }[] = []

export function triggersSystem(_dt: number) {
  // process action queue
  while (actionQueue.length > 0) {
    const { entity, action } = actionQueue.shift()!
    const actionEvents = getActionEvents(entity)
    actionEvents.emit(action.name, getPayload(action))
  }

  const entitiesWithTriggers = engine.getEntitiesWith(Triggers)
  for (const [entity, triggers] of entitiesWithTriggers) {
    if (initedEntities.has(entity)) {
      continue
    }

    // initialize triggers for given entity
    const types = triggers.value.reduce(
      (types, trigger) => types.add(trigger.type),
      new Set<TriggerType>(),
    )
    for (const type of types) {
      switch (type) {
        case TriggerType.ON_CLICK: {
          initOnClickTrigger(entity)
          break
        }
      }
    }

    // bind triggers
    const triggerEvents = getTriggerEvents(entity)
    for (const trigger of triggers.value) {
      triggerEvents.on(trigger.type, () => {
        if (checkConditions(trigger)) {
          for (const { entity, name } of trigger.actions) {
            if (entity && name) {
              const actions = Actions.getOrNull(entity)
              if (actions) {
                const action = actions.value.find(($) => $.name === name)
                if (action) {
                  // actions are enqueued to be executed on the next tick after all the triggers have been processed,
                  // this is to avoid one trigger messing with other trigger's conditions
                  actionQueue.push({ entity, action })
                }
              }
            }
          }
        }
      })
    }
    triggerEvents.emit(TriggerType.ON_SPAWN)

    initedEntities.add(entity)
  }
}

function checkConditions(trigger: Trigger) {
  if (trigger.conditions && trigger.conditions.length > 0) {
    const conditions = trigger.conditions.map(checkCondition)
    const isTrue = (result?: boolean) => !!result
    const operation = trigger.operation || TriggerConditionOperation.AND
    switch (operation) {
      case TriggerConditionOperation.AND: {
        return conditions.every(isTrue)
      }
      case TriggerConditionOperation.OR: {
        return conditions.some(isTrue)
      }
    }
  }
  // if there are no conditions, the trigger can continue
  return true
}

function checkCondition(condition: TriggerCondition) {
  const entity = condition.entity
  if (entity) {
    try {
      switch (condition.type) {
        case TriggerConditionType.WHEN_STATE_IS: {
          const states = States.getOrNull(entity)
          if (states !== null) {
            const currentValue = getCurrentValue(states)
            return currentValue === condition.value
          }
          break
        }
        case TriggerConditionType.WHEN_STATE_IS_NOT: {
          const states = States.getOrNull(entity)
          if (states !== null) {
            const currentValue = getCurrentValue(states)
            return currentValue !== condition.value
          }
          break
        }
      }
    } catch (error) {
      console.error('Error in condition', condition)
    }
  }
  return false
}

// ON_CLICK
function initOnClickTrigger(entity: Entity) {
  pointerEventsSystem.onPointerDown(
    {
      entity,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'Click',
      },
    },
    () => {
      const triggerEvents = getTriggerEvents(entity)
      triggerEvents.emit(TriggerType.ON_CLICK)
    },
  )
}