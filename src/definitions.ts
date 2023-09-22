import {
  IEngine,
  ISchema,
  LastWriteWinElementSetComponentDefinition,
  Schemas,
} from '@dcl/sdk/ecs'

export enum ComponentName {
  ACTION_TYPES = 'asset-packs::ActionTypes',
  ACTIONS = 'asset-packs::Actions',
  TRIGGERS = 'asset-packs::Triggers',
  STATES = 'asset-packs::States',
}

export enum ActionType {
  PLAY_ANIMATION = 'play_animation',
  SET_STATE = 'set_state',
}

export const ActionSchemas = {
  [ActionType.PLAY_ANIMATION]: Schemas.Map({ animation: Schemas.String }),
  [ActionType.SET_STATE]: Schemas.Map({ state: Schemas.String }),
}

export type ActionPayload<T extends ActionType = any> =
  T extends keyof typeof ActionSchemas
    ? (typeof ActionSchemas)[T] extends ISchema
      ? ReturnType<(typeof ActionSchemas)[T]['deserialize']>
      : {}
    : {}

export enum TriggerType {
  ON_CLICK = 'on_click',
  ON_STATE_CHANGE = 'on_state_change',
  ON_SPAWN = 'on_spawn',
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
  const ActionTypes = engine.defineComponent(ComponentName.ACTION_TYPES, {
    value: Schemas.Array(
      Schemas.Map({
        type: Schemas.String,
        schemaJson: Schemas.String,
      }),
    ),
  })

  const Actions = engine.defineComponent(ComponentName.ACTIONS, {
    value: Schemas.Array(
      Schemas.Map({
        name: Schemas.String,
        type: Schemas.String,
        payloadJson: Schemas.String,
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
        conditions: Schemas.Optional(
          Schemas.Array(
            Schemas.Map({
              entity: Schemas.Optional(Schemas.Entity),
              type: Schemas.EnumString<TriggerConditionType>(
                TriggerConditionType,
                TriggerConditionType.WHEN_STATE_IS,
              ),
              value: Schemas.String,
            }),
          ),
        ),
        operation: Schemas.Optional(
          Schemas.EnumString<TriggerConditionOperation>(
            TriggerConditionOperation,
            TriggerConditionOperation.AND,
          ),
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

  // Add actions from this package
  addActionType(
    engine,
    ActionType.PLAY_ANIMATION,
    ActionSchemas[ActionType.PLAY_ANIMATION],
  )
  addActionType(
    engine,
    ActionType.SET_STATE,
    ActionSchemas[ActionType.SET_STATE],
  )

  return {
    ActionTypes,
    Actions,
    Triggers,
    States,
  }
}

export type Components = ReturnType<typeof createComponents>

export type ActionTypesComponent = Components['ActionTypes']
export type ActionTypes = ReturnType<ActionTypesComponent['getOrCreateMutable']>

export type ActionsComponent = Components['Actions']
export type Action = ReturnType<ActionsComponent['get']>['value'][0]

export type TriggersComponent = Components['Triggers']
export type Trigger = ReturnType<TriggersComponent['get']>['value'][0]
export type TriggerAction = Trigger['actions'][0]
export type TriggerCondition = Exclude<Trigger['conditions'], undefined>[0]

export type StatesComponent = Components['States']
export type States = ReturnType<StatesComponent['get']>

export function getActionTypesComponent(engine: IEngine) {
  return engine.getComponent(
    ComponentName.ACTION_TYPES,
  ) as LastWriteWinElementSetComponentDefinition<ActionTypes>
}

export function addActionType<T extends ISchema>(
  engine: IEngine,
  type: string,
  schema?: T,
) {
  const ActionTypes = getActionTypesComponent(engine)
  const actionTypes = ActionTypes.getOrCreateMutable(engine.RootEntity)
  actionTypes.value.push({
    type,
    schemaJson: JSON.stringify(schema || Schemas.Map({})),
  })
}

export function getActionSchema(engine: IEngine, type: string): ISchema {
  const ActionTypes = getActionTypesComponent(engine)
  const actionTypes = ActionTypes.getOrCreateMutable(engine.RootEntity)
  const actionType = actionTypes.value.find(($) => $.type === type)
  return actionType ? JSON.parse(actionType.schemaJson) : null
}

export function getActionTypes(engine: IEngine) {
  const ActionTypes = getActionTypesComponent(engine)
  const actionTypes = ActionTypes.getOrCreateMutable(engine.RootEntity)
  return actionTypes.value.map(($) => $.type)
}
