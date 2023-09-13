import { engine, Entity, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { States, Triggers } from './components'
import {
  Trigger,
  TriggerCondition,
  TriggerConditionOperation,
  TriggerConditionType,
  TriggerType,
} from './definitions'
import { playAction } from './actions'
import { getCurrentValue } from './states'

const inited = new Set<Entity>()

export function triggersSystem(_dt: number) {
  const entitiesWithTriggers = engine.getEntitiesWith(Triggers)
  for (const [entity, triggers] of entitiesWithTriggers) {
    if (inited.has(entity)) {
      continue
    }

    for (const trigger of triggers.value) {
      switch (trigger.type) {
        case TriggerType.ON_CLICK: {
          initOnClickTrigger(entity, trigger)
          break
        }
      }
    }

    inited.add(entity)
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
  const entity = Number(condition.entity) as Entity
  if (isNaN(entity)) {
    console.error(`Invalid entity in condition`, condition)
    return
  }
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
  return false
}

// ON_CLICK
function initOnClickTrigger(entity: Entity, trigger: Trigger) {
  pointerEventsSystem.onPointerDown(
    {
      entity,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'Click',
      },
    },
    function () {
      console.log('ON_CLICK', entity, trigger)
      if (checkConditions(trigger)) {
        console.log('CONDITIONS PASSED')
        for (const action of trigger.actions) {
          playAction(action.entity, action.name)
        }
      }
    },
  )
}
