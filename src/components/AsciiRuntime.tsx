import { useEffect, useRef, useState } from 'react'

/**
 * A character-buffer runner that lives inside the hero terminal: no canvas,
 * no panel, no second color — just a 40x21 grid of glyphs painted straight
 * into a <pre>. The AI clears obstacles for three seconds, then deliberately
 * stops jumping so the cube comes apart, which is the whole joke.
 */

const COLS = 40
const ROWS = 21
// The ground sits low in the buffer: sky above for the jump arc, and five rows
// below so the debris keeps falling on screen instead of clipping at the edge.
const GROUND_ROW = 15
const CUBE_COL = 6
const FPS = 30
const FRAME_MS = 1000 / FPS

// Physics is in character cells: rows per frame, cols per frame.
const GRAVITY = 0.05 // apex ~4.5 rows, ~27 frames airborne
const JUMP_V = 0.67
const SPEED = 0.55 // obstacles cross the buffer in ~2.4s
const JUMP_RANGE = 6 // jump this many cols early — tuned to the apex window
// The cube is airborne ~27 frames, or ~15 cols of travel, so gaps below ~19
// would drop it straight onto the next triangle.
const GAP_MIN = 20
const GAP_MAX = 26
const FIRST_OBSTACLE = 24 // close enough that the cycle opens on a jump, not a wait
const DEBRIS_GRAVITY = 0.088 // debris falls harder than the cube jumps
const SABOTAGE_FRAME = FPS * 3
const CRASH_FRAMES = 26

const PARTICLE_CHARS = ['▪', '▫', '·', '∙', '◦']
const CUBE_IDLE = ['▛▜', '▙▟']
const CUBE_SPUN = ['██', '██']

type Obstacle = { x: number; scored: boolean }
type Particle = { x: number; y: number; vx: number; vy: number; char: string }

type World = {
  cubeY: number // rows above the floor
  vy: number
  airborne: boolean
  spun: boolean
  obstacles: Obstacle[]
  particles: Particle[]
  frame: number
  crashAt: number | null
  sabotaged: boolean
  nextGap: number
  cleared: number
  crashes: number
}

const randomGap = () => GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN)

// Counters survive the reset — they are the only proof the loop has history.
const createWorld = (cleared = 0, crashes = 0): World => ({
  cubeY: 0,
  vy: 0,
  airborne: false,
  spun: false,
  obstacles: [{ x: FIRST_OBSTACLE, scored: false }],
  particles: [],
  frame: 0,
  crashAt: null,
  sabotaged: false,
  nextGap: randomGap(),
  cleared,
  crashes,
})

const crash = (w: World) => {
  w.crashAt = w.frame
  w.crashes++
  for (let i = 0; i < 16; i++) {
    w.particles.push({
      x: CUBE_COL + Math.random() * 2,
      y: w.cubeY + Math.random() * 2,
      // Mostly blown backwards, the way the impact would throw it.
      vx: -0.7 + Math.random() * 0.85,
      vy: 0.25 + Math.random() * 0.75,
      char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
    })
  }
}

const step = (w: World) => {
  w.frame++

  // Once the cube is gone there is nothing to simulate but the debris.
  if (w.crashAt !== null) {
    for (const p of w.particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy -= DEBRIS_GRAVITY
    }
    w.particles = w.particles.filter((p) => p.x > -1 && p.x < COLS && p.y > -6)
    return
  }

  // The scripted failure: past the three-second mark the AI simply stops.
  if (w.frame >= SABOTAGE_FRAME) w.sabotaged = true

  if (w.airborne) {
    w.cubeY += w.vy
    w.vy -= GRAVITY
    if (w.cubeY <= 0) {
      w.cubeY = 0
      w.vy = 0
      w.airborne = false
    }
  }

  for (const o of w.obstacles) o.x -= SPEED

  const last = w.obstacles[w.obstacles.length - 1]
  if (!last || last.x <= COLS + 2 - w.nextGap) {
    w.obstacles.push({ x: COLS + 2, scored: false })
    w.nextGap = randomGap()
  }

  // Jump at the first obstacle still ahead of the cube.
  const next = w.obstacles.find((o) => o.x + 3 >= CUBE_COL)
  if (
    !w.sabotaged &&
    !w.airborne &&
    next &&
    next.x > CUBE_COL &&
    next.x - CUBE_COL <= JUMP_RANGE
  ) {
    w.airborne = true
    w.vy = JUMP_V
    w.spun = !w.spun // flipping the face on each jump reads as rotation
  }

  // The triangle is two rows tall, so anything under 2 rows up is a hit.
  for (const o of w.obstacles) {
    if (o.x <= CUBE_COL + 1 && o.x + 3 >= CUBE_COL && w.cubeY < 2) {
      crash(w)
      return
    }
  }

  for (const o of w.obstacles) {
    if (!o.scored && o.x + 3 < CUBE_COL) {
      o.scored = true
      w.cleared++
    }
  }
  w.obstacles = w.obstacles.filter((o) => o.x > -5)
}

const render = (w: World) => {
  const grid: string[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(' ')
  )

  const put = (row: number, col: number, ch: string) => {
    const c = Math.round(col)
    if (row < 0 || row >= ROWS || c < 0 || c >= COLS) return
    grid[row][c] = ch
  }

  for (let c = 0; c < COLS; c++) grid[GROUND_ROW][c] = '─'

  //  /\
  // /__\
  for (const o of w.obstacles) {
    const x = Math.round(o.x)
    put(GROUND_ROW - 2, x + 1, '/')
    put(GROUND_ROW - 2, x + 2, '\\')
    put(GROUND_ROW - 1, x, '/')
    put(GROUND_ROW - 1, x + 1, '_')
    put(GROUND_ROW - 1, x + 2, '_')
    put(GROUND_ROW - 1, x + 3, '\\')
  }

  if (w.crashAt === null) {
    const face = w.spun ? CUBE_SPUN : CUBE_IDLE
    const bottom = GROUND_ROW - 1 - Math.round(w.cubeY)
    put(bottom - 1, CUBE_COL, face[0][0])
    put(bottom - 1, CUBE_COL + 1, face[0][1])
    put(bottom, CUBE_COL, face[1][0])
    put(bottom, CUBE_COL + 1, face[1][1])
  }

  for (const p of w.particles) {
    put(GROUND_ROW - 1 - Math.round(p.y), p.x, p.char)
  }

  return grid.map((row) => row.join('')).join('\n')
}

export default function AsciiRuntime({ className = '' }: { className?: string }) {
  const preRef = useRef<HTMLPreElement>(null)
  const countRef = useRef<HTMLParagraphElement>(null)
  const [enabled, setEnabled] = useState(false)

  // Below 1000px the column collapses, so the loop must not run at all.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1000px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const pre = preRef.current
    const count = countRef.current
    if (!pre || !count || !enabled) return

    let world = createWorld()

    // Painted through refs, not state: 30 renders a second should never touch
    // React's reconciler.
    const paint = () => {
      pre.textContent = render(world)
      count.textContent = `cleared: ${world.cleared} · crashes: ${world.crashes}`
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // One still frame, composed so the space still reads as a scene.
      world.obstacles = [{ x: 24, scored: false }]
      paint()
      return
    }

    const id = window.setInterval(() => {
      step(world)
      if (world.crashAt !== null && world.frame - world.crashAt > CRASH_FRAMES) {
        world = createWorld(world.cleared, world.crashes)
      }
      paint()
    }, FRAME_MS)

    return () => window.clearInterval(id)
  }, [enabled])

  return (
    /* Decorative: 640 characters of glyphs would be noise to a screen reader. */
    <div
      aria-hidden
      /* Sized like the terminal copy next to it, not like a footnote. The vh
         term keeps all 21 rows inside a short window. */
      className={`text-[clamp(12px,min(1.05vw,1.7vh),16px)] leading-[1.05] text-amber-dim ${className}`}
    >
      <p className="mb-[0.6em] text-amber-faint">{'# runtime.js — running'}</p>
      <pre ref={preRef} className="font-terminal" />
      <p ref={countRef} className="mt-[0.6em] text-amber-faint tabular-nums" />
    </div>
  )
}
