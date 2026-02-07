import { Canvas, useFrame, invalidate } from '@react-three/fiber'
import { Environment, useGLTF, Center, Resize } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import * as THREE from 'three'

type HouseViewerProps = {
  url?: string
  width?: number | string
  height?: number | string
  modelScale?: number
  modelYOffset?: number
  color?: string
  partColors?: Record<string, string>
  debugMeshNames?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableMouseYaw?: boolean
  enableMouseFloat?: boolean
  mouseFloatX?: number
  mouseFloatY?: number
  baseYaw?: number
  basePitch?: number
  environmentPreset?: 'city' | 'sunset' | 'night' | 'dawn' | 'studio' | 'apartment' | 'forest' | 'park' | 'none'
}

const DEFAULT_URL = '/models/house.glb'
const HOVER_EASE = 0.15
const HOVER_MAG = (6 * Math.PI) / 180
const MOUSE_FLOAT_EASE = 0.14

const HouseModel: FC<{
  url: string
  modelScale: number
  modelYOffset: number
  color?: string
  partColors?: Record<string, string>
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
  const { scene } = useGLTF(url) as unknown as { scene: THREE.Group }
  const content = useMemo(() => scene.clone(), [scene])

  const group = useRef<THREE.Group>(null!)
  const targetYaw = useRef(0)
  const currentYaw = useRef(0)
  const targetOffsetX = useRef(0)
  const targetOffsetY = useRef(0)
  const currentOffsetX = useRef(0)
  const currentOffsetY = useRef(0)

  useLayoutEffect(() => {
    const palette = partColors ?? {}
    const fallback = color ? new THREE.Color(color) : null
    const normalizedPalette = new Map(
      Object.entries(palette).map(([name, value]) => [name.toLowerCase(), value]),
    )

    content.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return

      const override =
        palette[obj.name] ??
        normalizedPalette.get(obj.name.toLowerCase()) ??
        (obj.userData?.name ? normalizedPalette.get(String(obj.userData.name).toLowerCase()) : undefined)
      const tint = override ? new THREE.Color(override) : fallback

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      const nextMaterials = materials.map((m) => {
        const src = m as THREE.Material & {
          map?: THREE.Texture | null
          alphaMap?: THREE.Texture | null
          transparent?: boolean
          opacity?: number
          color?: THREE.Color
        }

        // Lambert returns depth/volume without harsh specular highlights.
        // If a tint is provided, we drop texture map to keep brand color clean.
        const lambert = new THREE.MeshLambertMaterial({
          color: tint ?? src.color ?? new THREE.Color('#ffffff'),
          map: tint ? null : (src.map ?? null),
          alphaMap: src.alphaMap ?? null,
          transparent: src.transparent ?? false,
          opacity: src.opacity ?? 1,
          side: m.side,
        })

        // Keep visible volume but compensate shadow darkening for brand tints.
        if (tint) {
          lambert.emissive = tint.clone()
          lambert.emissiveIntensity = 0.34
        } else {
          lambert.emissive = new THREE.Color('#000000')
          lambert.emissiveIntensity = 0
        }
        lambert.toneMapped = false
        return lambert
      })

      obj.material = Array.isArray(obj.material) ? nextMaterials : nextMaterials[0]
    })

  }, [content, color, partColors])

  useEffect(() => {
    if (!debugMeshNames) return
    const names = new Set<string>()
    content.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        names.add(obj.name || '(no-name)')
      }
    })
    // eslint-disable-next-line no-console
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
      <Center position={[0, modelYOffset, 0]}>
        <Resize scale={modelScale}>
          <primitive object={content} />
        </Resize>
      </Center>
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
          gl.toneMapping = THREE.NoToneMapping
          gl.outputColorSpace = THREE.SRGBColorSpace
          setReady(true)
        }}
      >
        {environmentPreset !== 'none' && (
          <Environment preset={environmentPreset} background={false} />
        )}
        <ambientLight intensity={0.95} color="#ffffff" />
        <hemisphereLight args={['#ffffff', '#f6f6f6', 0.2]} />
        <directionalLight position={[3.8, 4.2, 5.5]} intensity={0.38} color="#ffffff" />
        <directionalLight position={[-2.2, 1.4, 2.8]} intensity={0.12} color="#ffffff" />
        
        <Suspense fallback={null}>
          <HouseModel
            url={url}
            modelScale={modelScale}
            modelYOffset={modelYOffset}
            color={color}
            partColors={partColors}
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
