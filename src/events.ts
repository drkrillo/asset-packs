import mitt, { Emitter } from 'mitt'
import { Entity } from '@dcl/sdk/ecs'
import { ActionPayload, ActionType, TriggerType } from './definitions'

const triggers = new Map<Entity, Emitter<Record<TriggerType, void>>>()

const actions = new Map<
  Entity,
  Emitter<Record<string, ActionPayload<ActionType>>>
>()

export function getTriggerEvents(entity: Entity) {
  if (!triggers.has(entity)) {
    triggers.set(entity, mitt())
  }
  return triggers.get(entity)!
}

export function getActionEvents(entity: Entity) {
  if (!actions.has(entity)) {
    actions.set(entity, mitt())
  }
  return actions.get(entity)!
}
