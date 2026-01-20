import { useEffect, useRef, type RefObject } from 'react'
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Render,
  Runner,
  type IBodyDefinition,
} from 'matter-js'
import bounceTexture from '../../../assets/img/design/bounce.svg'
import styles from './bouncing-balls-physics.module.scss'

type Props = {
  wrapperRef: RefObject<HTMLElement>
  shelfIds?: string[]
  maxBalls?: number
  spawnMinMs?: number
  spawnMaxMs?: number
  gravityY?: number
  shelfThicknessPx?: number
}

const DEFAULT_SHELF_IDS = ['l1', 'l2', 'l3', 'l4']
const BALL_TEXTURE_SIZE = 65
const LINE_SVG_WIDTH = 979
const LINE_SVG_HEIGHT = 307
const LINE_PATH_START = { x: 8.63452, y: 0 }
const LINE_PATH_END = { x: 974.56, y: 258.819 }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const parseRotation = (transform: string) => {
  if (!transform || transform === 'none') return 0
  const match = transform.match(/matrix(3d)?\((.+)\)/)
  if (!match) return 0
  const values = match[2].split(',').map((value) => Number.parseFloat(value.trim()))
  if (values.length >= 6) {
    const [a, b] = values
    return Math.atan2(b, a)
  }
  return 0
}

const rotatePoint = (point: { x: number; y: number }, origin: { x: number; y: number }, angle: number) => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const dx = point.x - origin.x
  const dy = point.y - origin.y
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  }
}

const getShelfBodies = (
  wrapper: HTMLElement,
  shelfIds: string[],
  shelfThicknessPx: number | undefined,
  shelfOptions: IBodyDefinition,
) => {
  const wrapperRect = wrapper.getBoundingClientRect()
  return shelfIds
    .map((id) => wrapper.querySelector<HTMLElement>(`#${id}`))
    .filter((el): el is HTMLElement => Boolean(el))
    .map((el) => {
      const rect = el.getBoundingClientRect()
      const width = el.offsetWidth || rect.width
      const height = el.offsetHeight || rect.height
      const angle = parseRotation(getComputedStyle(el).transform)
      const bodyHeight = shelfThicknessPx ?? 14

      const parent = el.offsetParent as HTMLElement | null
      const parentRect = parent?.getBoundingClientRect()
      const left =
        (parentRect ? parentRect.left - wrapperRect.left : 0) + (el.offsetLeft || 0)
      const top =
        (parentRect ? parentRect.top - wrapperRect.top : 0) + (el.offsetTop || 0)

      const scaleX = width / LINE_SVG_WIDTH
      const scaleY = height / LINE_SVG_HEIGHT
      const localStart = {
        x: LINE_PATH_START.x * scaleX,
        y: LINE_PATH_START.y * scaleY,
      }
      const localEnd = {
        x: LINE_PATH_END.x * scaleX,
        y: LINE_PATH_END.y * scaleY,
      }
      const origin = { x: 0, y: height / 2 }
      const rotatedStart = rotatePoint(localStart, origin, angle)
      const rotatedEnd = rotatePoint(localEnd, origin, angle)
      const topEdgeStart = { x: left + rotatedStart.x, y: top + rotatedStart.y }
      const topEdgeEnd = { x: left + rotatedEnd.x, y: top + rotatedEnd.y }

      const dx = topEdgeEnd.x - topEdgeStart.x
      const dy = topEdgeEnd.y - topEdgeStart.y
      const length = Math.hypot(dx, dy)
      const dirX = dx / length
      const dirY = dy / length
      const normalA = { x: -dirY, y: dirX }
      const normalB = { x: dirY, y: -dirX }
      const normal = normalA.y >= normalB.y ? normalA : normalB
      const offset = {
        x: normal.x * (bodyHeight / 2),
        y: normal.y * (bodyHeight / 2),
      }

      const bodyStart = { x: topEdgeStart.x + offset.x, y: topEdgeStart.y + offset.y }
      const bodyEnd = { x: topEdgeEnd.x + offset.x, y: topEdgeEnd.y + offset.y }
      const center = { x: (bodyStart.x + bodyEnd.x) / 2, y: (bodyStart.y + bodyEnd.y) / 2 }
      const bodyAngle = Math.atan2(bodyEnd.y - bodyStart.y, bodyEnd.x - bodyStart.x)

      const body = Bodies.rectangle(center.x, center.y, length, bodyHeight, {
        ...shelfOptions,
        angle: bodyAngle,
      })
      ;(body as Body & { shelfLength: number; shelfStart: { x: number; y: number } }).shelfLength =
        length
      ;(body as Body & { shelfLength: number; shelfStart: { x: number; y: number } }).shelfStart =
        topEdgeStart
      return body
    })
}

const getSpawnPoint = (shelf?: Body & { shelfLength?: number }, yOffset = 80) => {
  if (!shelf) return { x: 0, y: -yOffset }
  const length = shelf.shelfLength ?? shelf.bounds.max.x - shelf.bounds.min.x
  const offset = (Math.random() - 0.5) * length * 0.9
  const dx = Math.cos(shelf.angle)
  const dy = Math.sin(shelf.angle)
  return {
    x: shelf.position.x + dx * offset,
    y: shelf.position.y + dy * offset - yOffset,
  }
}

const BouncingBallsPhysics: React.FC<Props> = ({
  wrapperRef,
  shelfIds = DEFAULT_SHELF_IDS,
  maxBalls = 16,
  spawnMinMs = 600,
  spawnMaxMs = 1200,
  gravityY = 1,
  shelfThicknessPx = 14,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<Engine | null>(null)
  const renderRef = useRef<Render | null>(null)
  const runnerRef = useRef<Runner | null>(null)
  const ballsRef = useRef<Body[]>([])
  const shelvesRef = useRef<Body[]>([])
  const spawnTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    // Physics tuning: gravity
    const engine = Engine.create({
      gravity: { x: 0, y: gravityY, scale: 0.001 },
    })
    engineRef.current = engine

    const render = Render.create({
      engine,
      canvas,
      options: {
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    })
    renderRef.current = render

    const runner = Runner.create()
    runnerRef.current = runner

    // Physics tuning: shelves friction
    const shelfOptions: IBodyDefinition = {
      isStatic: true,
      friction: 0.3,
      restitution: 0,
      render: { visible: false },
    }

    const getShelfElements = () =>
      shelfIds
        .map((id) => wrapper.querySelector<HTMLElement>(`#${id}`))
        .filter((el): el is HTMLElement => Boolean(el))

    const rebuildWorld = () => {
      const width = wrapper.clientWidth
      const height = wrapper.clientHeight
      if (!width || !height) return

      const pixelRatio = window.devicePixelRatio || 1
      render.options.width = width
      render.options.height = height
      render.canvas.width = width * pixelRatio
      render.canvas.height = height * pixelRatio
      render.canvas.style.width = `${width}px`
      render.canvas.style.height = `${height}px`
      Render.setPixelRatio(render, pixelRatio)

      Composite.clear(engine.world, false)
      ballsRef.current = []

      const wallThickness = 80
      const walls = [
        Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
          isStatic: true,
          render: { visible: false },
        }),
        Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
          isStatic: true,
          render: { visible: false },
        }),
        Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
          isStatic: true,
          render: { visible: false },
        }),
      ]

      const shelfBodies = getShelfBodies(wrapper, shelfIds, shelfThicknessPx, shelfOptions)
      shelvesRef.current = shelfBodies
      Composite.add(engine.world, [...walls, ...shelfBodies])
    }

    const spawnBall = () => {
      const width = wrapper.clientWidth
      const height = wrapper.clientHeight
      if (!width || !height) return
      if (ballsRef.current.length >= maxBalls) return

      const shelf = shelvesRef.current[0] as Body & {
        shelfLength?: number
        shelfStart?: { x: number; y: number }
      }
      const spawn =
        shelf?.shelfStart != null
          ? {
              x: shelf.shelfStart.x + Math.random() * 60,
              y: shelf.shelfStart.y - 20,
            }
          : getSpawnPoint(shelf, 80)
      const radius = 18
      // Physics tuning: ball restitution & friction
      const ball = Bodies.circle(
        clamp(spawn.x, radius, width - radius),
        Math.max(-100, spawn.y),
        radius,
        {
          restitution: 0.55,
          friction: 0.08,
          frictionAir: 0.02,
          render: {
            sprite: {
              texture: bounceTexture,
              xScale: (radius * 2) / BALL_TEXTURE_SIZE,
              yScale: (radius * 2) / BALL_TEXTURE_SIZE,
            },
          },
        },
      )

      ballsRef.current.push(ball)
      Composite.add(engine.world, ball)
    }

    const scheduleSpawn = () => {
      spawnBall()
      const next = spawnMinMs + Math.random() * (spawnMaxMs - spawnMinMs)
      spawnTimeoutRef.current = window.setTimeout(scheduleSpawn, next)
    }

    const shelfObserver = new ResizeObserver(() => {
      rebuildWorld()
    })

    const observeShelves = () => {
      shelfObserver.disconnect()
      getShelfElements().forEach((el) => shelfObserver.observe(el))
    }

    rebuildWorld()
    observeShelves()
    Render.run(render)
    Runner.run(runner, engine)
    scheduleSpawn()

    const onUpdate = () => {
      const height = wrapper.clientHeight
      ballsRef.current = ballsRef.current.filter((ball) => {
        if (ball.position.y > height + 200) {
          Composite.remove(engine.world, ball)
          return false
        }
        return true
      })
    }

    Events.on(engine, 'afterUpdate', onUpdate)

    const resizeObserver = new ResizeObserver(() => {
      rebuildWorld()
      observeShelves()
    })
    resizeObserver.observe(wrapper)
    window.addEventListener('resize', rebuildWorld)

    return () => {
      Events.off(engine, 'afterUpdate', onUpdate)
      resizeObserver.disconnect()
      shelfObserver.disconnect()
      window.removeEventListener('resize', rebuildWorld)
      if (spawnTimeoutRef.current) {
        window.clearTimeout(spawnTimeoutRef.current)
      }
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engine)
      Composite.clear(engine.world, false)
    }
  }, [
    wrapperRef,
    shelfIds,
    maxBalls,
    spawnMinMs,
    spawnMaxMs,
    gravityY,
    shelfThicknessPx,
  ])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}

export default BouncingBallsPhysics
