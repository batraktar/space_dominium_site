import { Canvas, useFrame, invalidate, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Color, Group, Mesh, MeshLambertMaterial, NoToneMapping, SRGBColorSpace } from 'three'
import type { Material, Texture } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cloneAndCenterScene } from './utils/center-model'

type EnvironmentPreset =
  | 'city'
  | 'sunset'
  | 'night'
  | 'dawn'
  | 'studio'
  | 'apartment'
  | 'forest'
  | 'park'
  | 'none'

type HouseViewerProps = {
  url?: string
  width?: number | string
  height?: number | string
  modelScale?: number
  modelYOffset?: number
  color?: string
  partColors?: Record<string, string>
  shadowLift?: number
  debugMeshNames?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableMouseYaw?: boolean
  enableMouseFloat?: boolean
  mouseFloatX?: number
  mouseFloatY?: number
  baseYaw?: number
  basePitch?: number
  environmentPreset?: EnvironmentPreset
}

const DEFAULT_URL = '/models/house.glb'
const HOVER_EASE = 0.15
const HOVER_MAG = (6 * Math.PI) / 180
const MOUSE_FLOAT_EASE = 0.14

const resolveEnvironmentLighting = (preset: Exclude<EnvironmentPreset, 'none'>) => {
  switch (preset) {
    case 'night':
      return { ambient: '#dbe7ff', ambientBoost: 0.1, key: '#d0dfff', keyBoost: 0.06, rim: '#9cb8ff' }
    case 'sunset':
      return { ambient: '#fff2db', ambientBoost: 0.08, key: '#ffd7ad', keyBoost: 0.05, rim: '#ffc38f' }
    case 'dawn':
      return { ambient: '#f4edff', ambientBoost: 0.07, key: '#dac9ff', keyBoost: 0.04, rim: '#c5abff' }
    case 'forest':
      return { ambient: '#e8f6ea', ambientBoost: 0.08, key: '#d3f0d8', keyBoost: 0.05, rim: '#b8e3bf' }
    case 'park':
      return { ambient: '#eef7e9', ambientBoost: 0.08, key: '#deefcb', keyBoost: 0.05, rim: '#c7dfae' }
    case 'apartment':
      return { ambient: '#f6f3ef', ambientBoost: 0.06, key: '#ebe4da', keyBoost: 0.04, rim: '#ddd2c5' }
    case 'studio':
      return { ambient: '#f7f7f8', ambientBoost: 0.04, key: '#ffffff', keyBoost: 0.03, rim: '#ececf2' }
    case 'city':
    default:
      return { ambient: '#eef3ff', ambientBoost: 0.07, key: '#dbe7ff', keyBoost: 0.05, rim: '#c2d5ff' }
  }
}

const HouseModel: FC<{
  url: string
  modelScale: number
  modelYOffset: number
  color?: string
  partColors?: Record<string, string>
  shadowLift: number
  debugMeshNames?: boolean
  autoRotate: boolean
  autoRotateSpeed: number
  enableMouseYaw: boolean
  enableMouseFloat: boolean
  mouseFloatX: number
  mouseFloatY: number
  baseYaw: number
  basePitch: number
}> = ({
  url,
  modelScale,
  modelYOffset,
  color,
  partColors,
  shadowLift,
  debugMeshNames,
  autoRotate,
  autoRotateSpeed,
  enableMouseYaw,
  enableMouseFloat,
  mouseFloatX,
  mouseFloatY,
  baseYaw,
  basePitch,
}) => {
  const loaded = useLoader(GLTFLoader, url) as { scene: Group }
  const content = useMemo(() => cloneAndCenterScene(loaded.scene), [loaded.scene])

  const group = useRef<Group>(null!)
  const targetYaw = useRef(0)
  const currentYaw = useRef(0)
  const targetOffsetX = useRef(0)
  const targetOffsetY = useRef(0)
  const currentOffsetX = useRef(0)
  const currentOffsetY = useRef(0)

  useLayoutEffect(() => {
    const palette = partColors ?? {}
    const fallback = color ? new Color(color) : null
    const normalizedPalette = new Map(
      Object.entries(palette).map(([name, value]) => [name.toLowerCase(), value]),
    )

    content.traverse((obj) => {
      if (!(obj instanceof Mesh)) return

      const override =
        palette[obj.name] ??
        normalizedPalette.get(obj.name.toLowerCase()) ??
        (obj.userData?.name ? normalizedPalette.get(String(obj.userData.name).toLowerCase()) : undefined)
      const tint = override ? new Color(override) : fallback

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      const nextMaterials = materials.map((m) => {
        const src = m as Material & {
          map?: Texture | null
          alphaMap?: Texture | null
          transparent?: boolean
          opacity?: number
          color?: Color
        }

        // Lambert returns depth/volume without harsh specular highlights.
        // If a tint is provided, we drop texture map to keep brand color clean.
        const lambert = new MeshLambertMaterial({
          color: tint ?? src.color ?? new Color('#ffffff'),
          map: tint ? null : (src.map ?? null),
          alphaMap: src.alphaMap ?? null,
          transparent: src.transparent ?? false,
          opacity: src.opacity ?? 1,
          side: m.side,
        })

        // Keep visible volume but compensate shadow darkening for brand tints.
        if (tint) {
          lambert.emissive = tint.clone()
          lambert.emissiveIntensity = shadowLift
        } else {
          lambert.emissive = new Color('#000000')
          lambert.emissiveIntensity = 0
        }
        lambert.toneMapped = false
        return lambert
      })

      obj.material = Array.isArray(obj.material) ? nextMaterials : nextMaterials[0]
    })

  }, [content, color, partColors, shadowLift])

  useEffect(() => {
    if (!debugMeshNames) return
    const names = new Set<string>()
    content.traverse((obj) => {
      if (obj instanceof Mesh) {
        names.add(obj.name || '(no-name)')
      }
    })
    console.log('HouseViewer meshes:', Array.from(names))
  }, [content, debugMeshNames])

  useEffect(() => {
    if (!enableMouseYaw && !enableMouseFloat) return

    const resetTargets = () => {
      targetYaw.current = 0
      targetOffsetX.current = 0
      targetOffsetY.current = 0
      invalidate()
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1

      if (enableMouseYaw) {
        targetYaw.current = nx * HOVER_MAG
      }
      if (enableMouseFloat) {
        targetOffsetX.current = nx * mouseFloatX
        targetOffsetY.current = -ny * mouseFloatY
      }
      invalidate()
    }

    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) resetTargets()
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerout', onPointerOut)
    window.addEventListener('blur', resetTargets)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', resetTargets)
    }
  }, [enableMouseYaw, enableMouseFloat, mouseFloatX, mouseFloatY])

  useFrame((_, dt) => {
    currentYaw.current += (targetYaw.current - currentYaw.current) * HOVER_EASE
    currentOffsetX.current += (targetOffsetX.current - currentOffsetX.current) * MOUSE_FLOAT_EASE
    currentOffsetY.current += (targetOffsetY.current - currentOffsetY.current) * MOUSE_FLOAT_EASE

    if (group.current) {
      group.current.rotation.x = basePitch
      group.current.rotation.y = baseYaw + currentYaw.current
      if (autoRotate) group.current.rotation.y += autoRotateSpeed * dt
      group.current.position.x = currentOffsetX.current
      group.current.position.y = currentOffsetY.current
    }

    const hasInertia =
      Math.abs(targetYaw.current - currentYaw.current) > 0.0005 ||
      Math.abs(targetOffsetX.current - currentOffsetX.current) > 0.0005 ||
      Math.abs(targetOffsetY.current - currentOffsetY.current) > 0.0005
    if (autoRotate || hasInertia) invalidate()
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

const HouseViewer: FC<HouseViewerProps> = ({
  url = DEFAULT_URL,
  width = 400,
  height = 400,
  modelScale = 1,
  modelYOffset = 0,
  color,
  partColors,
  shadowLift = 0.3,
  debugMeshNames,
  autoRotate = false,
  autoRotateSpeed = 0.25,
  enableMouseYaw = true,
  enableMouseFloat = true,
  mouseFloatX = 0.08,
  mouseFloatY = 0.06,
  baseYaw = -0.32,
  basePitch = -0.05,
  environmentPreset = 'none',
}) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
  }, [url])

  const envLighting = environmentPreset === 'none' ? null : resolveEnvironmentLighting(environmentPreset)

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas
        frameloop="demand"
        flat
        dpr={[1, 2]}
        gl={{ 
            antialias: true, 
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
        }}
        camera={{ fov: 50, position: [0, 0, 2.2], near: 0.01, far: 100 }}
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
          intensity={0.95 + (envLighting?.ambientBoost ?? 0)}
          color={envLighting?.ambient ?? '#ffffff'}
        />
        <hemisphereLight args={['#ffffff', '#f6f6f6', 0.2]} />
        <directionalLight
          position={[3.8, 4.2, 5.5]}
          intensity={0.38 + (envLighting?.keyBoost ?? 0)}
          color={envLighting?.key ?? '#ffffff'}
        />
        <directionalLight position={[-2.2, 1.4, 2.8]} intensity={0.12} color="#ffffff" />
        {envLighting && (
          <directionalLight position={[-3.2, 3.8, 1.6]} intensity={0.06} color={envLighting.rim} />
        )}
        
        <Suspense fallback={null}>
          <HouseModel
            url={url}
            modelScale={modelScale}
            modelYOffset={modelYOffset}
            color={color}
            partColors={partColors}
            shadowLift={shadowLift}
            debugMeshNames={debugMeshNames}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enableMouseYaw={enableMouseYaw}
            enableMouseFloat={enableMouseFloat}
            mouseFloatX={mouseFloatX}
            mouseFloatY={mouseFloatY}
            baseYaw={baseYaw}
            basePitch={basePitch}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HouseViewer
