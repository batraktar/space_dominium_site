import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
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
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableMouseYaw?: boolean
  environmentPreset?:
    | 'city'
    | 'sunset'
    | 'night'
    | 'dawn'
    | 'studio'
    | 'apartment'
    | 'forest'
    | 'park'
    | 'none'
}

const DEFAULT_URL = '/models/house.glb'
const HOVER_EASE = 0.15
const HOVER_MAG = (6 * Math.PI) / 180

const HouseModel: FC<{
  url: string
  modelScale: number
  modelYOffset: number
  color?: string
  autoRotate: boolean
  autoRotateSpeed: number
  enableMouseYaw: boolean
}> = ({ url, modelScale, modelYOffset, color, autoRotate, autoRotateSpeed, enableMouseYaw }) => {
  const { scene } = useGLTF(url) as unknown as { scene: THREE.Group }
  const content = useMemo(() => scene.clone(), [scene])
  const group = useRef<THREE.Group>(null!)
  const targetYaw = useRef(0)
  const currentYaw = useRef(0)
  const { camera } = useThree()

  useLayoutEffect(() => {
    const g = group.current
    g.clear()
    g.add(content)
    g.updateWorldMatrix(true, true)

    const box = new THREE.Box3().setFromObject(g)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    g.position.set(-center.x, -center.y + modelYOffset, -center.z)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? (1 / maxDim) * modelScale : modelScale
    g.scale.setScalar(scale)

    if (color) {
      const tint = new THREE.Color(color)
      g.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return
        const material = obj.material
        if (Array.isArray(material)) {
          material.forEach((m) => {
            if ('color' in m && m.color instanceof THREE.Color) m.color = tint.clone()
          })
        } else if ('color' in material && material.color instanceof THREE.Color) {
          material.color = tint.clone()
        }
      })
    }

    // keep model facing the camera by default
    group.current.rotation.set(0, 0, 0)

    // set a stable camera
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera
      persp.position.set(0, 0, 2.2)
      persp.updateProjectionMatrix()
    }
  }, [camera, content, modelScale, modelYOffset, color])

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
    group.current.rotation.y = currentYaw.current
    if (autoRotate) group.current.rotation.y += autoRotateSpeed * dt
  })

  return <group ref={group} />
}

const HouseViewer: FC<HouseViewerProps> = ({
  url = DEFAULT_URL,
  width = 400,
  height = 400,
  modelScale = 1,
  modelYOffset = 0,
  color,
  autoRotate = false,
  autoRotateSpeed = 0.25,
  enableMouseYaw = true,
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
        dpr={1}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 50, position: [0, 0, 2.2], near: 0.01, far: 100 }}
        style={{ touchAction: 'pan-y pinch-zoom', opacity: ready ? 1 : 0, transition: 'opacity 200ms ease' }}
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
