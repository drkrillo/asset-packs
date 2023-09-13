import { IEngine, Schemas } from '@dcl/sdk/ecs'

export enum ComponentName {
  ACTIONS = 'asset-packs::Actions',
  TRIGGERS = 'asset-packs::Triggers',
  STATES = 'asset-packs::States',
}

export enum ActionType {
  PLAY_ANIMATION = 'play_animation',
  SET_STATE = 'set_state',
}

export enum TriggerType {
  ON_CLICK = 'on_click',
}

export enum TriggerConditionType {
  WHEN_STATE_IS = 'when_state_is',
  WHEN_STATE_IS_NOT = 'when_state_is_not',
}

export enum TriggerConditionOperation {
  AND = 'and',
  OR = 'or',
}

export function createComponents(engine: IEngine) {
  const Actions = engine.defineComponent(ComponentName.ACTIONS, {
    value: Schemas.Array(
      Schemas.Map({
        name: Schemas.String,
        type: Schemas.EnumString<ActionType>(
          ActionType,
          ActionType.PLAY_ANIMATION,
        ),
        payload: Schemas.Map({
          playAnimation: Schemas.Optional(
            Schemas.Map({
              animation: Schemas.Optional(Schemas.String),
            }),
          ),
          setState: Schemas.Optional(
            Schemas.Map({
              state: Schemas.Optional(Schemas.String),
            }),
          ),
        }),
      }),
    ),
  })

  const Triggers = engine.defineComponent(ComponentName.TRIGGERS, {
    value: Schemas.Array(
      Schemas.Map({
        type: Schemas.EnumString<TriggerType>(
          TriggerType,
          TriggerType.ON_CLICK,
        ),
        conditions: Schemas.Array(
          Schemas.Map({
            entity: Schemas.Optional(Schemas.Entity),
            type: Schemas.String,
            value: Schemas.String,
          }),
        ),
        operation: Schemas.EnumString<TriggerConditionOperation>(
          TriggerConditionOperation,
          TriggerConditionOperation.AND,
        ),
        actions: Schemas.Array(
          Schemas.Map({
            entity: Schemas.Optional(Schemas.Entity),
            name: Schemas.Optional(Schemas.String),
          }),
        ),
      }),
    ),
  })

  const States = engine.defineComponent(ComponentName.STATES, {
    value: Schemas.Array(Schemas.String),
    defaultValue: Schemas.Optional(Schemas.String),
    currentValue: Schemas.Optional(Schemas.String),
  })

  return {
    Actions,
    Triggers,
    States,
  }
}

export type Components = ReturnType<typeof createComponents>

export type ActionsComponent = Components['Actions']
export type Action = ReturnType<ActionsComponent['get']>['value'][0]

export type TriggersComponent = Components['Triggers']
export type Trigger = ReturnType<TriggersComponent['get']>['value'][0]
export type TriggerAction = Trigger['actions'][0]
export type TriggerCondition = Trigger['conditions'][0]

export type StatesComponent = Components['States']
export type States = ReturnType<StatesComponent['get']>