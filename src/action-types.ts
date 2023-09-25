import {
  IEngine,
  ISchema,
  JsonSchemaExtended,
  LastWriteWinElementSetComponentDefinition,
  Schemas,
} from '@dcl/sdk/ecs'
import {
  Action,
  ActionPayload,
  ActionType,
  ActionTypes,
  ComponentName,
} from './definitions'

export const EMPTY: JsonSchemaExtended = {
  type: 'object',
  properties: {},
  serializationType: 'map',
}

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
  const actionType = {
    type,
    jsonSchema: JSON.stringify(
      schema?.jsonSchema || Schemas.Map({}).jsonSchema,
    ),
  }
  actionTypes.value = [
    ...actionTypes.value.filter(($) => $.type !== actionType.type),
    actionType,
  ]
}

export function getActionSchema<T = unknown>(engine: IEngine, type: string) {
  const ActionTypes = getActionTypesComponent(engine)
  const actionTypes = ActionTypes.getOrCreateMutable(engine.RootEntity)
  const actionType = actionTypes.value.find(($) => $.type === type)
  const jsonSchema: JsonSchemaExtended = actionType
    ? JSON.parse(actionType.jsonSchema)
    : EMPTY
  return Schemas.fromJson(jsonSchema) as ISchema<T>
}

export function getActionTypes(engine: IEngine) {
  const ActionTypes = getActionTypesComponent(engine)
  const actionTypes = ActionTypes.getOrCreateMutable(engine.RootEntity)
  return actionTypes.value.map(($) => $.type)
}

export function getPayload<T extends ActionType>(action: Action) {
  return JSON.parse(action.jsonPayload) as ActionPayload<T>
}

export function getJson<T extends ActionType>(payload: ActionPayload<T>) {
  return JSON.stringify(payload)
}