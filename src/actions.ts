import { engine, Entity, Animator } from '@dcl/sdk/ecs'
import { Actions, States } from './components'
import { Action, ActionType } from './definitions'
import { getDefaultValue, isValidState } from './states'

const inited = new Set<Entity>()

export const actions = new Map<Entity, Map<string, () => void>>()

function addAction(entity: Entity, name: string, callback: () => void) {
  if (!actions.has(entity)) {
    actions.set(entity, new Map<string, () => void>())
  }
  const entityActions = actions.get(entity)!
  entityActions.set(name, callback)
}

export function executeAction(entity?: Entity, name?: string) {
  if (entity && name) {
    const entityActions = actions.get(entity)
    if (entityActions && entityActions.has(name)) {
      const callback = entityActions.get(name)!
      callback()
    }
  }
}

export function actionsSystem(dt: number) {
  const entitiesWithActions = engine.getEntitiesWith(Actions)
  for (const [entity, actions] of entitiesWithActions) {
    if (inited.has(entity)) {
      continue
    }

    for (const action of actions.value) {
      switch (action.type) {
        case ActionType.PLAY_ANIMATION: {
          initPlayAnimationAction(entity, action)
          break
        }
        case ActionType.SET_STATE: {
          initStateStateAction(entity, action)
          break
        }
      }
    }

    inited.add(entity)
  }
}

// PLAY_ANIMATION
function initPlayAnimationAction(entity: Entity, action: Action) {
  const clipName = action.payload.playAnimation?.animation || ''
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
    animator.states = [
      ...animator.states,
      {
        name: clipName,
        clip: clipName,
      },
    ]
  }

  addAction(entity, action.name, () => {
    Animator.stopAllAnimations(entity)
    const clip = Animator.getClip(entity, clipName)
    clip.playing = true
    clip.loop = false
  })
}

// SET_STATE
function initStateStateAction(entity: Entity, action: Action) {
  addAction(entity, action.name, () => {
    const states = States.getMutableOrNull(entity)
    if (states) {
      let nextState = action.payload.setState?.state
      nextState = isValidState(states, nextState)
        ? nextState
        : getDefaultValue(states)
      states.currentValue = nextState
    }
  })
}
