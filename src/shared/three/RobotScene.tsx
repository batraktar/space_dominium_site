import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import RobotModel from './RobotModel'
import { useInView } from '../hooks/useInView'

type Props = {
  modelUrl: string
  className?: string
  modelScale?: number
  cameraPosition?: [number, number, number]
  fov?: number
}

const RobotScene: React.FC<Props> = ({
  modelUrl,
  className,
  modelScale = 1,
  cameraPosition = [0, 0.6, 2.4],
  fov = 35,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(wrapperRef, {
    threshold: 0.2,
    rootMargin: '120px',
    freezeOnceVisible: false,
  })
  const [tabActive, setTabActive] = React.useState(true)

  React.useEffect(() => {
    const handleVisibility = () => {
      setTabActive(document.visibilityState === 'visible')
    }
    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Pause animation when tab is hidden or component is off-screen.
  const active = inView && tabActive

  return (
    <div ref={wrapperRef} className={className}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: cameraPosition, fov }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />
        <Suspense fallback={null}>
          <RobotModel modelUrl={modelUrl} active={active} modelScale={modelScale} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default RobotScene
