import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
import { Environment, useGLTF, Center, Resize } from '@react-three/drei' // Додали Center та Resize
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
  environmentPreset?: 'city' | 'sunset' | 'night' | 'dawn' | 'studio' | 'apartment' | 'forest' | 'park' | 'none'
}

const DEFAULT_URL = '/models/house.glb'
const HOVER_EASE = 0.15
const HOVER_MAG = (6 * Math.PI) / 180

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
}) => {
  const { scene } = useGLTF(url) as unknown as { scene: THREE.Group }
  
  // 1. Клонуємо сцену один раз. Це база.
  const content = useMemo(() => scene.clone(), [scene])
  
  const group = useRef<THREE.Group>(null!)
  const targetYaw = useRef(0)
  const currentYaw = useRef(0)

  // 2. Логіка фарбування - окремо. Вона безпечна для перезапуску.
  useLayoutEffect(() => {
    const palette = partColors ?? {}
    const fallback = color ? new THREE.Color(color) : null
    if (!fallback && Object.keys(palette).length === 0) return

    content.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return

      const override = palette[obj.name]
      const tint = override ? new THREE.Color(override) : fallback
      if (!tint) return

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      const nextMaterials = materials.map((m) => {
        const cloned = m.userData.isCloned ? m : m.clone()
        cloned.userData.isCloned = true
        if ('color' in cloned) cloned.color.copy(tint)
        return cloned
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

  // 3. Інтерактивність миші
  useEffect(() => {
    if (!enableMouseYaw) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      targetYaw.current = nx * HOVER_MAG
      invalidate()
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [enableMouseYaw])

  useFrame((_, dt) => {
    currentYaw.current += (targetYaw.current - currentYaw.current) * HOVER_EASE
    if (group.current) {
        group.current.rotation.y = currentYaw.current
        if (autoRotate) group.current.rotation.y += autoRotateSpeed * dt
    }
  })

  // 4. Рендер. 
  // <Resize> автоматично нормалізує розмір моделі до 1.
  // <Center> автоматично ставить її в центр (0,0,0).
  // Ми просто додаємо scale={modelScale} зверху.
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
  environmentPreset = 'none',
}) => {
  const [ready, setReady] = useState(false)

  // Скидаємо ready при зміні URL, але не при зміні кольору
  useEffect(() => {
    setReady(false)
  }, [url])

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]} // Адаптивний DPR для кращої продуктивності
        gl={{ 
            antialias: true, 
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true // Іноді допомагає з context lost
        }}
        camera={{ fov: 50, position: [0, 0, 2.2], near: 0.01, far: 100 }}
        style={{ 
            touchAction: 'pan-y pinch-zoom', 
            opacity: ready ? 1 : 0, 
            transition: 'opacity 200ms ease' 
        }}
        onCreated={() => setReady(true)}
      >
        {environmentPreset !== 'none' && (
          <Environment preset={environmentPreset} background={false} />
        )}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 6]} intensity={1} />
        
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
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HouseViewer
