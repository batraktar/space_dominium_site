import { Box3, Group, Vector3 } from 'three'

export const cloneAndCenterScene = (scene: Group): Group => {
  const cloned = scene.clone()
  cloned.updateMatrixWorld(true)

  const bounds = new Box3().setFromObject(cloned)
  if (bounds.isEmpty()) return cloned

  const center = bounds.getCenter(new Vector3())
  cloned.position.sub(center)
  return cloned
}
