import React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'

type Props = {
  modelUrl: string
  active: boolean
  modelScale?: number
}

// Lightweight clips for idle + micro-actions (head/body shifts).
const createClips = () => {
  const idle = new THREE.AnimationClip('idle', 2.2, [
    new THREE.NumberKeyframeTrack('.position[y]', [0, 1.1, 2.2], [0, 0.02, 0]),
    new THREE.NumberKeyframeTrack('.rotation[z]', [0, 1.1, 2.2], [0, 0.02, 0]),
  ])

  const headTurn = new THREE.AnimationClip('headTurn', 1.2, [
    new THREE.NumberKeyframeTrack('RobotHead.rotation[y]', [0, 0.6, 1.2], [0, 0.35, 0]),
  ])

  const bodyTilt = new THREE.AnimationClip('bodyTilt', 1.4, [
    new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.7, 1.4], [0, 0.18, 0]),
  ])

  const poseShift = new THREE.AnimationClip('poseShift', 1.6, [
    new THREE.NumberKeyframeTrack('.rotation[y]', [0, 0.8, 1.6], [0, 0.2, 0]),
  ])

  return [idle, headTurn, bodyTilt, poseShift]
}

const findHeadNode = (scene: THREE.Object3D) => {
  let head: THREE.Object3D | null = null
  let maxY = -Infinity
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const box = new THREE.Box3().setFromObject(child)
    const center = box.getCenter(new THREE.Vector3())
    if (center.y > maxY) {
      maxY = center.y
      head = child
    }
  })
  return head
}

const RobotModel: React.FC<Props> = ({ modelUrl, active, modelScale = 1 }) => {
  const group = React.useRef<THREE.Object3D>(null)
  const leftLeg = React.useMemo(() => new THREE.Group(), [])
  const rightLeg = React.useMemo(() => new THREE.Group(), [])
  const legsReady = React.useRef(false)
  const { scene } = useGLTF(modelUrl)
  const headNode = React.useMemo(() => findHeadNode(scene), [scene])
  const clips = React.useMemo(() => createClips(), [])
  const { actions, mixer } = useAnimations(clips, group)
  const actionTimeout = React.useRef<number | null>(null)
  const returnTimeout = React.useRef<number | null>(null)

  // Normalize model size and center it inside the group.
  React.useEffect(() => {
    scene.name = 'RobotRoot'
    if (headNode) headNode.name = 'RobotHead'
  }, [scene, headNode])

  // Random micro-motions every 3-7s, blending with idle.
  React.useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = 1.3 / Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(scale * modelScale)
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  }, [scene, modelScale])

  React.useEffect(() => {
    if (!group.current || legsReady.current) return

    leftLeg.name = 'RobotLegLeft'
    rightLeg.name = 'RobotLegRight'
    group.current.add(leftLeg)
    group.current.add(rightLeg)

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const legCutoff = box.min.y + (box.max.y - box.min.y) * 0.35
    const leftMeshes: THREE.Object3D[] = []
    const rightMeshes: THREE.Object3D[] = []

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const childBox = new THREE.Box3().setFromObject(child)
      const childCenter = childBox.getCenter(new THREE.Vector3())
      if (childCenter.y > legCutoff) return
      if (childCenter.x < center.x) {
        leftMeshes.push(child)
      } else {
        rightMeshes.push(child)
      }
    })

    leftMeshes.forEach((mesh) => leftLeg.attach(mesh))
    rightMeshes.forEach((mesh) => rightLeg.attach(mesh))

    const pivotGroup = (legGroup: THREE.Group) => {
      if (!legGroup.children.length) return
      const legBox = new THREE.Box3().setFromObject(legGroup)
      const pivot = legBox.getCenter(new THREE.Vector3())
      pivot.y = legBox.max.y
      legGroup.position.copy(pivot)
      legGroup.children.forEach((child) => {
        child.position.sub(pivot)
      })
    }

    pivotGroup(leftLeg)
    pivotGroup(rightLeg)

    legsReady.current = leftMeshes.length + rightMeshes.length > 0
  }, [leftLeg, rightLeg, scene])

  React.useEffect(() => {
    if (!actions?.idle) return
    actions.idle.reset().fadeIn(0.4).play()
    return () => {
      Object.values(actions).forEach((action) => action?.stop())
    }
  }, [actions])

  React.useEffect(() => {
    if (!actions || !active) {
      if (actionTimeout.current) window.clearTimeout(actionTimeout.current)
      if (returnTimeout.current) window.clearTimeout(returnTimeout.current)
      if (mixer) mixer.timeScale = 0
      return
    }

    mixer.timeScale = 1

    const idle = actions.idle
    const pool = ['headTurn', 'bodyTilt', 'poseShift']

    const schedule = () => {
      const delay = 3000 + Math.random() * 4000
      actionTimeout.current = window.setTimeout(() => {
        const name = pool[Math.floor(Math.random() * pool.length)]
        const action = actions[name]
        if (!action || !idle) return

        action.reset()
        action.setLoop(THREE.LoopOnce, 1)
        action.clampWhenFinished = true
        action.fadeIn(0.35).play()
        idle.fadeOut(0.35)

        const durationMs = action.getClip().duration * 1000
        returnTimeout.current = window.setTimeout(() => {
          action.fadeOut(0.3)
          idle.reset().fadeIn(0.4).play()
        }, durationMs)

        schedule()
      }, delay)
    }

    schedule()

    return () => {
      if (actionTimeout.current) window.clearTimeout(actionTimeout.current)
      if (returnTimeout.current) window.clearTimeout(returnTimeout.current)
    }
  }, [actions, active, mixer])

  useFrame((_, delta) => {
    if (!active || !mixer) return
    mixer.update(delta)
    if (!legsReady.current) return
    const t = performance.now() * 0.002
    const swing = Math.sin(t) * 0.25
    leftLeg.rotation.x = swing
    rightLeg.rotation.x = -swing
    leftLeg.rotation.z = Math.sin(t * 0.8) * 0.08
    rightLeg.rotation.z = -Math.sin(t * 0.8) * 0.08
  })

  return <primitive ref={group} object={scene} />
}

export default RobotModel
