import { States } from './definitions'

const isValid = (states: States, value: string | undefined) =>
  !!value && states.value.includes(value)

export function getCurrentValue(states: States) {
  if (isValid(states, states.currentValue)) {
    return states.currentValue!
  }
  return getDefaultValue(states)
}

export function getDefaultValue(states: States) {
  if (isValid(states, states.defaultValue)) {
    return states.defaultValue!
  }
  if (states.value.length > 0) {
    return states.value[0]
  }
  return null
}
