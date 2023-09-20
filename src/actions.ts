import { engine, Entity, Animator } from '@dcl/sdk/ecs'
import { Actions, States } from './components'
import { ActionPayload, ActionType, TriggerType } from './definitions'
import { getDefaultValue, isValidState } from './states'
import { getActionEvents, getTriggerEvents } from './events'

const initedEntities = new Set<Entity>()

export function actionsSystem(_dt: number) {
  const entitiesWithActions = engine.getEntitiesWith(Actions)
  for (const [entity, actions] of entitiesWithActions) {
    if (initedEntities.has(entity)) {
      continue
    }

    const actionEvents = getActionEvents(entity)
    for (const action of actions.value) {
      actionEvents.on(action.name, () => {
        switch (action.type) {
          case ActionType.PLAY_ANIMATION: {
            handlePlayAnimation(entity, action.payload)
            break
          }
          case ActionType.SET_STATE: {
            handleSetState(entity, action.payload)
            break
          }
        }
      })
    }

    initedEntities.add(entity)
  }
}

// PLAY_ANIMATION
function handlePlayAnimation(entity: Entity, action: ActionPayload) {
  const clipName = action.playAnimation?.animation || ''

  if (!Animator.has(entity)) {
    Animator.create(entity, {
      states: [
        {
          name: clipName,
          clip: clipName,
        },
      ],
    })
  } else {
    const animator = Animator.getMutable(entity)
    if (!animator.states.some(($) => $.name === clipName)) {
      animator.states = [
        ...animator.states,
        {
          name: clipName,
          clip: clipName,
        },
      ]
    }
  }

  Animator.stopAllAnimations(entity)
  const clip = Animator.getClip(entity, clipName)
  clip.playing = true
  clip.loop = false
}

// SET_STATE
function handleSetState(entity: Entity, action: ActionPayload) {
  const states = States.getMutableOrNull(entity)

  if (states) {
    let nextState = action.setState?.state
    nextState = isValidState(states, nextState)
      ? nextState
      : getDefaultValue(states)
    states.currentValue = nextState

    const triggerEvents = getTriggerEvents(entity)
    triggerEvents.emit(TriggerType.ON_STATE_CHANGE)
  }
}
