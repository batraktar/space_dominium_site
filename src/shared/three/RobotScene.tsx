import { Canvas, invalidate, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Color, Mesh, MeshLambertMaterial, NoToneMapping, SRGBColorSpace } from 'three'
import type { Euler, Group, Material, Object3D, Texture } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cloneAndCenterScene } from './utils/center-model'

type EnvironmentPreset =
  | 'city' | 'sunset' | 'night' | 'dawn' | 'studio' | 'apartment' | 'forest' | 'park' | 'none'

type RobotSceneProps = {
  modelUrl: string
  width?: number | string
  height?: number | string
  modelScale?: number
  modelYOffset?: number
  baseColor?: string
  partColors?: Record<string, string>
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableMouseYaw?: boolean
  walkOnCard?: boolean
  hiddenNodeNames?: string[]
  environmentPreset?: EnvironmentPreset
  cameraPosition?: [number, number, number]
  cameraFov?: number
}

const HOVER_EASE = 0.15
const HOVER_MAG = (6 * Math.PI) / 180

const resolveEnvironmentLighting = (preset: Exclude<EnvironmentPreset, 'none'>) => {
  switch (preset) {
    case 'night':
      return { ambient: '#dbe7ff', ambientBoost: 0.12, key: '#d0dfff', keyBoost: 0.25, rim: '#9cb8ff' }
    case 'sunset':
      return { ambient: '#fff2db', ambientBoost: 0.1, key: '#ffd7ad', keyBoost: 0.2, rim: '#ffc38f' }
    case 'dawn':
      return { ambient: '#f4edff', ambientBoost: 0.1, key: '#dac9ff', keyBoost: 0.2, rim: '#c5abff' }
    case 'forest':
      return { ambient: '#e8f6ea', ambientBoost: 0.1, key: '#d3f0d8', keyBoost: 0.2, rim: '#b8e3bf' }
    case 'park':
      return { ambient: '#eef7e9', ambientBoost: 0.1, key: '#deefcb', keyBoost: 0.2, rim: '#c7dfae' }
    case 'apartment':
      return { ambient: '#f6f3ef', ambientBoost: 0.08, key: '#ebe4da', keyBoost: 0.15, rim: '#ddd2c5' }
    case 'studio':
      return { ambient: '#f7f7f8', ambientBoost: 0.06, key: '#ffffff', keyBoost: 0.15, rim: '#ececf2' }
    case 'city':
    default:
      return { ambient: '#eef3ff', ambientBoost: 0.1, key: '#dbe7ff', keyBoost: 0.2, rim: '#c2d5ff' }
  }
}

const RobotModel: FC<{
  url: string
  modelScale: number
  modelYOffset: number
  baseColor?: string
  partColors?: Record<string, string>
  autoRotate: boolean
  autoRotateSpeed: number
  enableMouseYaw: boolean
  walkOnCard: boolean
  hiddenNodeNames?: string[]
}> = ({
  url,
  modelScale,
  modelYOffset,
  baseColor,
  partColors,
  autoRotate,
  autoRotateSpeed,
  enableMouseYaw,
  walkOnCard,
  hiddenNodeNames,
}) => {
  const loaded = useLoader(GLTFLoader, url) as { scene: Group }
  // Клонуємо і центруємо сцену для стабільного позиціонування моделі.
  const content = useMemo(() => cloneAndCenterScene(loaded.scene), [loaded.scene])
  
  const group = useRef<Group>(null!)
  const targetYaw = useRef(0)
  const currentYaw = useRef(0)
  const partsRef = useRef<Record<string, Object3D | null>>({})
  const baseRotRef = useRef<Record<string, Euler>>({})

  useEffect(() => {
    const palette = partColors ?? {}
    const fallback = baseColor ? new Color(baseColor) : null
    const canonicalizeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const stripNumericSuffix = (name: string) => name.replace(/\d+$/, '')
    const normalizedPalette = new Map<string, string>()

    Object.entries(palette).forEach(([name, value]) => {
      const lower = name.toLowerCase()
      const canonical = canonicalizeName(name)
      const canonicalNoSuffix = stripNumericSuffix(canonical)

      normalizedPalette.set(lower, value)
      normalizedPalette.set(canonical, value)
      if (canonicalNoSuffix) normalizedPalette.set(canonicalNoSuffix, value)
    })

    const resolveColorByName = (name?: string) => {
      if (!name) return undefined
      const lower = name.toLowerCase()
      const canonical = canonicalizeName(name)
      const canonicalNoSuffix = stripNumericSuffix(canonical)

      return (
        palette[name] ??
        normalizedPalette.get(lower) ??
        normalizedPalette.get(canonical) ??
        normalizedPalette.get(canonicalNoSuffix)
      )
    }

    content.traverse((obj) => {
      if (!(obj instanceof Mesh)) return

      const meshMaterial = Array.isArray(obj.material) ? obj.material[0] : obj.material
      const materialName = meshMaterial?.name

      let override =
        resolveColorByName(obj.name) ??
        resolveColorByName(obj.userData?.name ? String(obj.userData.name) : undefined) ??
        resolveColorByName(materialName)

      // Some imported GLB meshes keep generic names (Cube.001, etc.).
      // In that case take color from nearest named parent part (Head, Body, Shoulder_Ring_*, ...).
      if (!override) {
        let parent = obj.parent
        while (parent) {
          override =
            resolveColorByName(parent.name) ??
            resolveColorByName(parent.userData?.name ? String(parent.userData.name) : undefined)
          if (override) break
          parent = parent.parent
        }
      }

      const tint = override ? new Color(override) : fallback

      if (!tint) return

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      const nextMaterials = materials.map((m) => {
        const src = m as Material & {
          map?: Texture | null
          alphaMap?: Texture | null
          transparent?: boolean
          opacity?: number
        }
        const lambert = new MeshLambertMaterial({
          color: tint,
          map: null,
          alphaMap: src.alphaMap ?? null,
          transparent: src.transparent ?? false,
          opacity: src.opacity ?? 1,
          side: m.side,
        })
        lambert.emissive = tint.clone()
        lambert.emissiveIntensity = 0.2
        lambert.toneMapped = false
        return lambert
      })

      obj.material = Array.isArray(obj.material) ? nextMaterials : nextMaterials[0]
    })
  }, [content, baseColor, partColors])

  useEffect(() => {
    const find = (name: string) => content.getObjectByName(name) ?? null
    const findFirst = (names: string[]) => {
      for (const name of names) {
        const hit = find(name)
        if (hit) return hit
      }
      return null
    }

    const hidden = new Set(hiddenNodeNames ?? [])
    if (hidden.size > 0) {
      content.traverse((obj) => {
        if (hidden.has(obj.name)) obj.visible = false
      })
    }

    const attachTo = (childName: string, ...parentNames: string[]) => {
      if (parentNames.length === 0) return
      const chain = [childName, ...parentNames]

      for (let i = 0; i < chain.length - 1; i += 1) {
        const child = find(chain[i])
        const parent = find(chain[i + 1])
        if (!child || !parent || child.parent === parent) continue
        // Keep world transform while attaching so elements stay in-place.
        parent.attach(child)
      }
    }
    const attachToObject = (childName: string, parent: Object3D | null) => {
      const child = find(childName)
      if (!child || !parent || child.parent === parent) return
      parent.attach(child)
    }

    // Build simple hierarchy for imported model where many nodes are siblings.
    // This keeps eyes/rings visually attached while animating parent parts.
    attachTo('Eye_L', 'Head')
    attachTo('Eye_R', 'Head')
    attachTo('Ear_L', 'Head')
    attachTo('Ear_R', 'Head')
    attachTo('ERROR_404', 'Head')
    attachTo('Neck_Joint_Ring', 'Neck')
    attachTo('Wrist_Ring_L', 'Elbow_L')
    attachTo('Wrist_Ring_R', 'Elbow_R')
    attachTo('Wrist_L', 'Wrist_Ring_L') 
    attachTo('Wrist_R', 'Wrist_Ring_R')
    attachTo('Finger_Inner_L', 'Finger_Inner_Joint_L', 'Elbow_L')
    attachTo('Finger_Middle_L', 'Finger_Middle_Joint_L', 'Elbow_L')
    attachTo('Finger_Outer_L', 'Finger_Outer_Joint_L', 'Elbow_L')
    attachTo('Finger_Inner_R', 'Finger_Inner_Joint_R', 'Elbow_R')
    attachTo('Finger_Middle_R', 'Finger_Middle_Joint_R', 'Elbow_R')
    attachTo('Finger_Outer_Joint_R.001', 'Finger_Outer_Joint_R', 'Elbow_R')
    attachTo('Finger_Outer_Joint_R001', 'Finger_Outer_Joint_R', 'Elbow_R')
    attachTo('Finger_Outer_Joint_R_1', 'Finger_Outer_Joint_R', 'Elbow_R')
    attachTo('Finger_Outer_Joint_L_1', 'Finger_Outer_Joint_L', 'Elbow_L')
    attachTo('Shoulder_Armor_R', 'Shoulder_R')
    attachTo('Shoulder_Armor_L', 'Shoulder_L')
    attachTo('Radiator_R', 'Ear_R')
    attachTo('Radiator_L', 'Ear_L')

    const shoulderRingAnchor = findFirst([
      'Cube005_2',
      'Cube.005_2',
      'Cube.005',
      'Cube005',
      'Power_Pack',
      'Body',
    ])
    attachToObject('Shoulder_Ring_R', shoulderRingAnchor)
    attachToObject('Shoulder_Ring_L', shoulderRingAnchor)

    attachTo('Elbow_Armor_L', 'Elbow_L')
    attachTo('Elbow_Armor_R', 'Elbow_R')
    attachTo('Elbow_Ring_L', 'Forearm_L')
    attachTo('Elbow_Ring_R', 'Forearm_R')

    partsRef.current = {
      Head: find('Head'),
      Body: find('Body'),
      Neck: find('Neck'),
      Neck_Joint_Ring: find('Neck_Joint_Ring'),
      Shoulder_L: find('Shoulder_L'),
      Shoulder_R: find('Shoulder_R'),
      Shoulder_Armor_L: find('Shoulder_Armor_L'),
      Shoulder_Armor_R: find('Shoulder_Armor_R'),
      Shoulder_Ring_L: find('Shoulder_Ring_L'),
      Shoulder_Ring_R: find('Shoulder_Ring_R'),
      Forearm_L: find('Forearm_L'),
      Forearm_R: find('Forearm_R'),
      Elbow_L: find('Elbow_L'),
      Elbow_R: find('Elbow_R'),
      Elbow_Armor_L: find('Elbow_Armor_L'),
      Elbow_Armor_R: find('Elbow_Armor_R'),
      Elbow_Ring_L: find('Elbow_Ring_L'),
      Elbow_Ring_R: find('Elbow_Ring_R'),
      Wrist_L: find('Wrist_L'),
      Wrist_R: find('Wrist_R'),
      Wrist_Ring_L: find('Wrist_Ring_L'),
      Wrist_Ring_R: find('Wrist_Ring_R'),
      Ear_L: find('Ear_L'),
      Ear_R: find('Ear_R'),
      Eye_L: find('Eye_L'),
      Eye_R: find('Eye_R'),
      ERROR_404: find('ERROR_404'),
    }
    baseRotRef.current = {}
    Object.entries(partsRef.current).forEach(([key, obj]) => {
      if (!obj) return
      baseRotRef.current[key] = obj.rotation.clone()
    })
  }, [content, hiddenNodeNames])

  const setLocalRot = (key: string, x = 0, y = 0, z = 0) => {
    const obj = partsRef.current[key]
    const base = baseRotRef.current[key]
    if (!obj || !base) return
    obj.rotation.set(base.x + x, base.y + y, base.z + z)
  }

  useEffect(() => {
    if (!enableMouseYaw) return
    const resetTarget = () => {
      targetYaw.current = 0
      invalidate()
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      targetYaw.current = nx * HOVER_MAG
      invalidate()
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerout', resetTarget)
    window.addEventListener('blur', resetTarget)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', resetTarget)
      window.removeEventListener('blur', resetTarget)
    }
  }, [enableMouseYaw])

  useEffect(() => {
    if (walkOnCard) return
    Object.keys(baseRotRef.current).forEach((key) => setLocalRot(key, 0, 0, 0))
    if (group.current) {
      group.current.position.x = 0
      group.current.position.y = 0
    }
  }, [walkOnCard])

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime()
    currentYaw.current += (targetYaw.current - currentYaw.current) * HOVER_EASE
    
    if (group.current) {
      if (walkOnCard) {
        const travel = Math.sin(t * 0.58)
        const bob = Math.sin(t * 4.1)
        const stride = Math.sin(t * 2.9)
        const counter = Math.sin(t * 2.9 + Math.PI)
        const facing = Math.cos(t * 0.58) * 0.18

        group.current.position.x = travel * 0.14
        group.current.position.y = bob * 0.009
        group.current.rotation.y = facing

        setLocalRot('Head', bob * 0.009, Math.sin(t * 1.2) * 0.045, 0)
        setLocalRot('Neck', 0, Math.sin(t * 1.2) * 0.02, 0)
        setLocalRot('Body', 0, 0, bob * 0.004)
        setLocalRot('Shoulder_L', stride * 0.17, 0, 0)
        setLocalRot('Shoulder_R', counter * 0.17, 0, 0)
        setLocalRot('Forearm_L', stride * 0.12, 0, 0)
        setLocalRot('Forearm_R', counter * 0.12, 0, 0)
        setLocalRot('Elbow_L', stride * 0.08, 0, 0)
        setLocalRot('Elbow_R', counter * 0.08, 0, 0)
        setLocalRot('Wrist_L', stride * 0.05, 0, 0)
        setLocalRot('Wrist_R', counter * 0.05, 0, 0)
      } else {
        group.current.position.x = 0
        group.current.position.y = 0
        group.current.rotation.y = currentYaw.current
        if (autoRotate) group.current.rotation.y += autoRotateSpeed * dt
      }
    }

    const hasInertia = Math.abs(targetYaw.current - currentYaw.current) > 0.0005
    if (walkOnCard || autoRotate || hasInertia) invalidate()
  })

  return (
    <group ref={group}>
      <group position={[0, modelYOffset, 0]}>
        <group scale={modelScale}>
          <primitive object={content} />
        </group>
      </group>
    </group>
  )
}

const RobotScene: FC<RobotSceneProps> = ({
  modelUrl,
  width = '100%',
  height = '100%',
  modelScale = 1,
  modelYOffset = 0,
  baseColor,
  partColors,
  autoRotate = false,
  autoRotateSpeed = 0.25,
  enableMouseYaw = true,
  walkOnCard = false,
  hiddenNodeNames,
  environmentPreset = 'none',
  cameraPosition = [0, 0, 2.2],
  cameraFov = 50,
}) => {
  const [ready, setReady] = useState(false)

  // Скидаємо стан при зміні URL
  useEffect(() => {
    setReady(false)
  }, [modelUrl])

  const envLighting = environmentPreset === 'none' ? null : resolveEnvironmentLighting(environmentPreset)

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas
        frameloop="demand"
        flat
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: cameraFov, position: cameraPosition, near: 0.01, far: 100 }}
        style={{ 
          touchAction: 'pan-y pinch-zoom', 
          opacity: ready ? 1 : 0, 
          transition: 'opacity 200ms ease' 
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = NoToneMapping
          gl.outputColorSpace = SRGBColorSpace
          setReady(true)
        }}
      >
        <ambientLight
          intensity={0.6 + (envLighting?.ambientBoost ?? 0)}
          color={envLighting?.ambient ?? '#ffffff'}
        />
        <directionalLight
          position={[4, 4, 6]}
          intensity={1 + (envLighting?.keyBoost ?? 0)}
          color={envLighting?.key ?? '#ffffff'}
        />
        {envLighting && <directionalLight position={[-3, 3.5, 2]} intensity={0.2} color={envLighting.rim} />}
        
        <Suspense fallback={null}>
          <RobotModel
            url={modelUrl}
            modelScale={modelScale}
            modelYOffset={modelYOffset}
            baseColor={baseColor}
            partColors={partColors}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enableMouseYaw={enableMouseYaw}
            walkOnCard={walkOnCard}
            hiddenNodeNames={hiddenNodeNames}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default RobotScene
