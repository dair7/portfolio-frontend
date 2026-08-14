import { useEffect, useRef } from 'react'

/**
 * The hero name, drawn as beveled blocks instead of set as text.
 *
 * The text is rasterized once into a small binary matrix, then each lit cell is
 * redrawn as a chunky square with a light top-left edge and a dark bottom-right
 * one — the LEGO stud read.
 *
 * Size is *derived*, never chosen: a hidden span carries the exact type scale
 * the name used to be set at, and the block pitch is whatever makes the matrix
 * span that same width. So the name occupies the width it always did, at every
 * viewport, and stays on the clamp it was already on.
 */

/**
 * Font size of the source raster — the one knob that trades definition against
 * chunkiness, because the on-screen width is fixed: more columns means each
 * block has to be smaller to span the same width.
 *
 *   11px → ~88 cols, ~8px blocks, 1.4px bevel — fat studs, letters illegible
 *   14px → ~110 cols, ~6.5px blocks, 1.2px bevel — the middle setting
 *   16px → ~125 cols, ~5.8px blocks, 1px bevel — legible, bevel is a hint
 *
 * 16 is deliberate: at this width the grid reads as a fine LED panel with a lit
 * edge rather than as physical studs. That is the cost of legibility at a fixed
 * width, and legibility is the tiebreaker.
 */
const RASTER_PX = 16

/**
 * Weight of the source raster — *not* the weight the name is set in, since it
 * is never set as text. At 16px a bold stroke is thick enough to close the
 * counters of 'a', 'e' and 'o', which turns them into solid blocks and makes
 * the name ambiguous. 600 thins the stroke without touching the column count:
 * a mono face keeps the same advance width at every weight, so the layout does
 * not move. Drop to 500 if the counters still fill.
 *
 * Only 400/500/600/700 are loaded (see the @import in `index.css`); any other
 * value would be synthesized from 400 and raster unpredictably.
 */
const RASTER_WEIGHT = 600

/** Alpha above which a rasterized pixel counts as ink. */
const ALPHA_THRESHOLD = 110

/**
 * Empty columns forced between adjacent glyphs, and the width a space becomes.
 * Counted in grid columns, not font units, so the separation survives whatever
 * the raster resolution is — at low resolutions the side bearings of a bold
 * mono face are under a pixel, which is what fused the letters together.
 */
const LETTER_GAP_COLS = 2
const SPACE_COLS = 5

/** Gap and bevel as fractions of the block, so they scale with the viewport.
 *  A third of the pitch is what makes the grid legible as a grid; below that
 *  the blocks close up into a continuous mass. */
const GAP_RATIO = 1 / 3
const BEVEL_RATIO = 1 / 4

/** Blur of the glow pass, in blocks. Kept to a single block: a wider halo
 *  floods the gaps with amber and undoes the grid it sits behind. */
const GLOW_BLOCKS = 1

const FILL = '#FFB300'
const BEVEL_LIGHT = 'rgba(255,232,160,0.85)'
const BEVEL_DARK = 'rgba(90,55,0,0.6)'
const GLOW = 'rgba(255,179,0,0.28)'

/* The site's own mono, not the JetBrains Mono the prototype used — it is
   already loaded, it is the face the rest of the terminal is set in, and at a
   ~15-row bitmap a second webfont would cost a download to change nothing but
   the shape of the 'G'. */
const FONT_STACK = '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace'

/** Rasterizes one glyph into a `h`-tall matrix. Every glyph is drawn on the
 *  same baseline in the same box, so their rows line up when concatenated. */
function rasterChar(char: string, fontPx: number, h: number): number[][] | null {
  const off = document.createElement('canvas')
  const probe = off.getContext('2d')
  if (!probe) return null

  probe.font = `${RASTER_WEIGHT} ${fontPx}px ${FONT_STACK}`
  // Slack on both sides: a bold face can overhang its own advance width.
  const w = Math.ceil(probe.measureText(char).width) + 4
  if (w <= 4 || h <= 0) return null

  // Resizing a canvas resets its context, so the font has to be set again after.
  off.width = w
  off.height = h
  const ctx = off.getContext('2d')
  if (!ctx) return null

  ctx.font = `${RASTER_WEIGHT} ${fontPx}px ${FONT_STACK}`
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.fillText(char, 2, h / 2)

  const data = ctx.getImageData(0, 0, w, h).data
  const grid: number[][] = []
  for (let y = 0; y < h; y++) {
    const row: number[] = []
    for (let x = 0; x < w; x++) {
      row.push(data[(y * w + x) * 4 + 3] > ALPHA_THRESHOLD ? 1 : 0)
    }
    grid.push(row)
  }
  return grid
}

/** Drops the blank columns on either side of a glyph, so the space between
 *  letters is the one this module inserts and not the font's own bearings. */
function trimColumns(grid: number[][]): number[][] {
  const width = grid[0]?.length ?? 0
  const inked = (x: number) => grid.some((row) => row[x] === 1)

  let left = 0
  while (left < width && !inked(left)) left++
  if (left === width) return []

  let right = width - 1
  while (right > left && !inked(right)) right--

  return grid.map((row) => row.slice(left, right + 1))
}

/**
 * Rasterizes `text` glyph by glyph and lays the results out on one grid with a
 * fixed gutter between them.
 *
 * Rasterizing the whole string in one pass is what made the name illegible: at
 * this size the gap the font leaves between two letters is a fraction of a
 * pixel, so neighbouring strokes landed in the same column and merged. Spacing
 * measured in columns cannot round down to zero.
 */
function raster(text: string, fontPx: number): number[][] | null {
  const h = Math.ceil(fontPx * 1.35)
  if (h <= 0) return null

  // Built column-major, because laying glyphs side by side is appending columns.
  const columns: number[][] = []
  const blank = () => new Array<number>(h).fill(0)
  let atWordStart = true

  for (const char of text) {
    if (char === ' ') {
      for (let i = 0; i < SPACE_COLS; i++) columns.push(blank())
      // The word gap already separates; no letter gap on top of it.
      atWordStart = true
      continue
    }

    const glyph = rasterChar(char, fontPx, h)
    if (!glyph) return null
    const trimmed = trimColumns(glyph)
    if (trimmed.length === 0) continue

    if (!atWordStart) {
      for (let i = 0; i < LETTER_GAP_COLS; i++) columns.push(blank())
    }
    const width = trimmed[0].length
    for (let x = 0; x < width; x++) {
      columns.push(trimmed.map((row) => row[x]))
    }
    atWordStart = false
  }

  if (columns.length === 0) return null

  const grid: number[][] = []
  for (let y = 0; y < h; y++) grid.push(columns.map((col) => col[y]))

  // The 1.35 line box leaves several dead rows above and below the glyphs.
  // Trimming them is what keeps the block roughly the height the text was,
  // instead of the height of its line box.
  const inked = (row: number[]) => row.some((cell) => cell === 1)
  const top = grid.findIndex(inked)
  if (top === -1) return null
  let bottom = grid.length - 1
  while (bottom > top && !inked(grid[bottom])) bottom--

  return grid.slice(top, bottom + 1)
}

function draw(canvas: HTMLCanvasElement, grid: number[][], targetWidth: number) {
  const rows = grid.length
  const cols = grid[0].length

  // The whole size contract lives on this line: the matrix spans exactly the
  // width the text used to.
  const block = targetWidth / cols
  const gap = block * GAP_RATIO
  const solid = block - gap
  const bevel = Math.max(1, solid * BEVEL_RATIO)
  const glowBlur = block * GLOW_BLOCKS

  // Room for the glow to spill without being clipped at the canvas edge.
  const pad = Math.ceil(glowBlur + block)
  const cssW = cols * block + pad * 2
  const cssH = rows * block + pad * 2

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  // The padding would otherwise indent the name relative to the `$` lines
  // above it; pulling it back puts the first block on the same gutter.
  canvas.style.marginLeft = `${-pad}px`
  canvas.style.marginBlock = `${-pad / 2}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  // Pass 1 — the blocks, carrying a single soft glow for the whole word. Done
  // first and separately so the bevels below are not smeared by the shadow.
  ctx.shadowColor = GLOW
  ctx.shadowBlur = glowBlur
  ctx.fillStyle = FILL
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) ctx.fillRect(pad + x * block, pad + y * block, solid, solid)
    }
  }

  // Pass 2 — the bevel: lit from the top left, so every block reads as a solid
  // piece rather than a flat square.
  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!grid[y][x]) continue
      const bx = pad + x * block
      const by = pad + y * block

      ctx.fillStyle = BEVEL_LIGHT
      ctx.fillRect(bx, by, solid, bevel)
      ctx.fillRect(bx, by, bevel, solid)

      ctx.fillStyle = BEVEL_DARK
      ctx.fillRect(bx, by + solid - bevel, solid, bevel)
      ctx.fillRect(bx + solid - bevel, by, bevel, solid)
    }
  }
}

interface Props {
  text: string
  /** The type scale the name is measured against — the canvas matches its width. */
  metricsClassName: string
}

export default function PixelName({ text, metricsClassName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const metricRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const metric = metricRef.current
    if (!canvas || !metric) return

    let cancelled = false
    let grid: number[][] | null = null

    const render = () => {
      if (!grid) return

      // What the name would have measured as text...
      const natural = metric.getBoundingClientRect().width
      // ...capped to the column it lives in. As text the name could wrap at its
      // space; a canvas cannot, so on a narrow viewport the un-capped width ran
      // past the terminal frame and the last letters were clipped away.
      const host = canvas.parentElement
      const available = host ? host.clientWidth : 0
      const targetWidth = available > 0 ? Math.min(natural, available) : natural

      if (targetWidth === 0) return
      draw(canvas, grid, targetWidth)
    }

    // The raster bakes in whatever face is loaded the instant it runs, so it
    // has to wait for the webfont — otherwise the blocks are the shape of the
    // system fallback and never correct themselves.
    document.fonts.ready.then(() => {
      if (cancelled) return
      grid = raster(text, RASTER_PX)
      render()
    })

    // The name sits on a vw/vh clamp, so its target width moves with the
    // window. Only the redraw is repeated; the matrix itself never changes.
    //
    // A ResizeObserver rather than a window `resize` listener: the listener
    // fired before the new layout had settled, so shrinking and re-widening the
    // window left the canvas drawn at the previous width until the next resize.
    let lastWidth = -1
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width
      // Height-only notifications are this canvas reacting to its own redraw —
      // acting on them would be an infinite loop.
      if (Math.abs(width - lastWidth) < 0.5) return
      lastWidth = width
      render()
    })
    observer.observe(metric.parentElement ?? canvas)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [text, metricsClassName])

  return (
    <>
      {/* The heading's actual text. The canvas is decoration. */}
      <span className="sr-only">{text}</span>

      {/* Invisible, but laid out — it is what the canvas measures itself
          against, so the two can never disagree about how wide the name is. */}
      <span
        ref={metricRef}
        aria-hidden
        className={`invisible absolute top-0 left-0 whitespace-nowrap ${metricsClassName}`}
      >
        {text}
      </span>

      <canvas ref={canvasRef} aria-hidden className="block max-w-none" />
    </>
  )
}
