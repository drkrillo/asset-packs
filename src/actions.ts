import { engine, Entity, Animator } from '@dcl/sdk/ecs'
import { Actions, States } from './components'
import { Action, ActionPayload, ActionType, TriggerType } from './definitions'
import { getDefaultValue, isValidState } from './states'
import { getActionEvents, getTriggerEvents } from './events'

const initedEntities = new Set<Entity>()

export function getPayload<T extends ActionType>(action: Action) {
  return JSON.parse(action.jsonPayload) as ActionPayload<T>
}

export function actionsSystem(_dt: number) {
  const entitiesWithActions = engine.getEntitiesWith(Actions)
  for (const [entity, actions] of entitiesWithActions) {
    if (initedEntities.has(entity)) {
      continue
    }

    // initialize actions for given entity
    const types = actions.value.reduce(
      (types, action) => types.add(action.type),
      new Set<String>(),
    )
    for (const type of types) {
      switch (type) {
        case ActionType.PLAY_ANIMATION: {
          initPlayAnimation(entity)
          break
        }
        default:
          break
      }
    }

    // bind actions
    const actionEvents = getActionEvents(entity)
    for (const action of actions.value) {
      actionEvents.on(action.name, () => {
        switch (action.type) {
          case ActionType.PLAY_ANIMATION: {
            handlePlayAnimation(
              entity,
              getPayload<ActionType.PLAY_ANIMATION>(action),
            )
            break
          }
          case ActionType.SET_STATE: {
            handleSetState(entity, getPayload<ActionType.SET_STATE>(action))
            break
          }
          default:
            break
        }
      })
    }

    initedEntities.add(entity)
  }
}

// PLAY_ANIMATION
function initPlayAnimation(entity: Entity) {
  Animator.create(entity, {
    states: [],
  })
  Animator.stopAllAnimations(entity)
}

function handlePlayAnimation(
  entity: Entity,
  payload: ActionPayload<ActionType.PLAY_ANIMATION>,
) {
  const clipName = payload.animation

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

  Animator.stopAllAnimations(entity)
  const clip = Animator.getClip(entity, clipName)
  clip.playing = true
  clip.loop = false
}

// SET_STATE
function handleSetState(
  entity: Entity,
  payload: ActionPayload<ActionType.SET_STATE>,
) {
  const states = States.getMutableOrNull(entity)

  if (states) {
    let nextState: string | undefined = payload.state
    nextState = isValidState(states, nextState)
      ? nextState
      : getDefaultValue(states)
    states.currentValue = nextState

    const triggerEvents = getTriggerEvents(entity)
    triggerEvents.emit(TriggerType.ON_STATE_CHANGE)
  }
}
