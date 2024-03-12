import { Entity, IEngine } from '@dcl/sdk/ecs'
import { EngineComponents, getComponents } from './definitions'
import { Color4, Quaternion } from '@dcl/sdk/math'

const bars = new Map<Entity, Entity>()
const backgrounds = new Map<Entity, Entity>()

const SCALE = 0.5

export function createCounterBarSystem(
  engine: IEngine,
  components: EngineComponents,
) {
  const { Material, MeshRenderer, Transform, Billboard } = components
  const { Counter, CounterBar } = getComponents(engine)
  return function counterBarSystem() {
    for (const [
      entity,
      { value },
      { color, maxValue },
    ] of engine.getEntitiesWith(Counter, CounterBar)) {
      if (!bars.has(entity)) {
        const container = engine.addEntity()
        Transform.create(container, { parent: entity })
        Billboard.create(container)

        const bar = engine.addEntity()
        bars.set(entity, bar)
        Material.setPbrMaterial(bar, {
          albedoColor: Color4.Green(),
        })
        MeshRenderer.setCylinder(bar)
        Transform.create(bar, {
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 0.1 * SCALE, y: 1 * SCALE, z: 0.1 * SCALE },
          rotation: Quaternion.fromEulerDegrees(0, 0, 90),
          parent: container,
        })

        const background = engine.addEntity()
        backgrounds.set(entity, background)
        Material.setPbrMaterial(background, {
          albedoColor: Color4.Red(),
        })
        MeshRenderer.setCylinder(background)
        Transform.create(background, {
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 0.09 * SCALE, y: 1 * SCALE, z: 0.09 * SCALE },
          rotation: Quaternion.fromEulerDegrees(0, 0, 90),
          parent: container,
        })
      }

      const currentValue = Math.max(Math.min(value / 10, 1), 0) / (1 / SCALE) // 0.75
      const bar = bars.get(entity)!
      const background = backgrounds.get(entity)!
      const barTransform = Transform.getMutable(bar)
      barTransform.position.x = (currentValue - SCALE) / 2 // -0.125
      barTransform.scale.y = currentValue

      const backgroundTransform = Transform.getMutable(background)
      backgroundTransform.position.x = SCALE / 2 + barTransform.position.x
      backgroundTransform.scale.y = SCALE - currentValue
    }
  }
}
