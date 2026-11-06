import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Point { x: number; y: number }
interface Ripple extends Point { radius: number; opacity: number; born: number }

const CELL_SIZE = 55
const INFLUENCE_RADIUS = 260
const MAX_WARP = 24
const DOT_SPACING = 28
const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 }
const NODE_BASE_RADIUS = 1.8
const NODE_ACTIVE_RADIUS = 3.2

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t

function lerpColor(base: typeof LINE_BASE, active: typeof LINE_BASE, t: number) {
  const r = Math.round(lerpN(base.r, active.r, t))
  const g = Math.round(lerpN(base.g, active.g, t))
  const b = Math.round(lerpN(base.b, active.b, t))
  return `rgba(${r},${g},${b},${lerpN(base.a, active.a, t).toFixed(3)})`
}

export default function KineticGrid({ children, className, globalColor = 'default', colorScheme = 'light' }: {
  children?: ReactNode
  className?: string
  globalColor?: 'default' | 'monochrome'
  colorScheme?: 'light' | 'dark'
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<Point>({ x: -9999, y: -9999 })
  const ripplesRef = useRef<Ripple[]>([])
  const sizeRef = useRef({ w: 0, h: 0 })

  const getWarpedPoint = useCallback((gx: number, gy: number, col: number, row: number, mouse: Point, ripples: Ripple[], cols: number, rows: number) => {
    const edgeMargin = 1.5
    const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1)
    const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1)
    const pinFactor = colPin * colPin * rowPin * rowPin
    const dx = gx - mouse.x
    const dy = gy - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor
    let rx = 0
    let ry = 0

    for (const ripple of ripples) {
      const rdx = gx - ripple.x
      const rdy = gy - ripple.y
      const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
      const diff = rdist - ripple.radius
      if (Math.abs(diff) < 55) {
        const strength = (1 - Math.abs(diff) / 55) * ripple.opacity * 18 * pinFactor
        const angle = Math.atan2(rdy, rdx)
        const sign = diff < 0 ? -1 : 1
        rx += Math.cos(angle) * strength * sign * -1
        ry += Math.sin(angle) * strength * sign * -1
      }
    }

    if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
      const t = dist / INFLUENCE_RADIUS
      const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60)
      const warpAmount = eased * MAX_WARP * pinFactor
      const angle = Math.atan2(dy, dx)
      return { pt: { x: gx - Math.cos(angle) * warpAmount + rx, y: gy - Math.sin(angle) * warpAmount + ry }, proximity }
    }

    return { pt: { x: gx + rx, y: gy + ry }, proximity }
  }, [])

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { w: W, h: H } = sizeRef.current
    const mouse = mouseRef.current
    const ripples = ripplesRef.current
    const theme = globalColor === 'monochrome'
      ? colorScheme === 'dark'
        ? { bg: '#080a09', lineBase: { r: 238, g: 241, b: 238, a: .12 }, lineActive: { r: 238, g: 241, b: 238, a: .9 }, nodeBase: { r: 238, g: 241, b: 238, a: .2 }, nodeActive: { r: 238, g: 241, b: 238, a: 1 }, glow: '238,241,238', ripple: '238,241,238', dots: 'rgba(238,241,238,0.05)' }
        : { bg: '#ffffff', lineBase: { r: 0, g: 0, b: 0, a: .12 }, lineActive: { r: 0, g: 0, b: 0, a: .9 }, nodeBase: { r: 0, g: 0, b: 0, a: .2 }, nodeActive: { r: 0, g: 0, b: 0, a: 1 }, glow: '0,0,0', ripple: '0,0,0', dots: 'rgba(0,0,0,0.06)' }
      : { bg: '#161618', lineBase: LINE_BASE, lineActive: { r: 74, g: 158, b: 255, a: .9 }, nodeBase: { r: 255, g: 255, b: 255, a: .2 }, nodeActive: { r: 74, g: 158, b: 255, a: 1 }, glow: '74,158,255', ripple: '100,180,255', dots: 'rgba(255,255,255,0.05)' }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = theme.bg
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = theme.dots
    for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
      ctx.beginPath(); ctx.arc(x, y, .7, 0, Math.PI * 2); ctx.fill()
    }

    for (let index = ripples.length - 1; index >= 0; index--) {
      const ripple = ripples[index]
      const age = (now - ripple.born) / 1000
      ripple.radius = Math.max(0, age * 400)
      ripple.opacity = Math.max(0, 1 - age * 1.2)
      if (ripple.opacity <= 0) ripples.splice(index, 1)
    }

    const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1
    const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1
    const cellW = W / (cols - 1)
    const cellH = H / (rows - 1)
    const points: Point[][] = []
    const proximity: number[][] = []

    for (let row = 0; row < rows; row++) {
      points[row] = []
      proximity[row] = []
      for (let col = 0; col < cols; col++) {
        const warped = getWarpedPoint(col * cellW, row * cellH, col, row, mouse, ripples, cols, rows)
        points[row][col] = warped.pt
        proximity[row][col] = warped.proximity
      }
    }

    const drawSegment = (a: Point, b: Point, proximityA: number, proximityB: number) => {
      const average = (proximityA + proximityB) / 2
      const t = average * average * (3 - 2 * average)
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = lerpColor(theme.lineBase, theme.lineActive, t)
      ctx.lineWidth = lerpN(.8, 1.5, t)
      ctx.stroke()
    }

    ctx.lineCap = 'butt'
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols - 1; col++) drawSegment(points[row][col], points[row][col + 1], proximity[row][col], proximity[row][col + 1])
    for (let col = 0; col < cols; col++) for (let row = 0; row < rows - 1; row++) drawSegment(points[row][col], points[row + 1][col], proximity[row][col], proximity[row + 1][col])

    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const point = points[row][col]
      const raw = proximity[row][col]
      const t = raw * raw * (3 - 2 * raw)
      const radius = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t)
      if (t > .3) {
        const glowRadius = radius + lerpN(0, 6, (t - .3) / .7)
        const gradient = ctx.createRadialGradient(point.x, point.y, radius * .5, point.x, point.y, glowRadius)
        gradient.addColorStop(0, `rgba(${theme.glow},${(t * .3).toFixed(3)})`)
        gradient.addColorStop(1, `rgba(${theme.glow},0)`)
        ctx.beginPath(); ctx.arc(point.x, point.y, glowRadius, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill()
      }
      ctx.beginPath(); ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = lerpColor(theme.nodeBase, theme.nodeActive, t)
      ctx.fill()
    }

    for (const ripple of ripples) {
      ctx.beginPath(); ctx.arc(ripple.x, ripple.y, Math.max(0, ripple.radius), 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${theme.ripple},${(ripple.opacity * .28).toFixed(3)})`
      ctx.lineWidth = 1.5; ctx.stroke()
    }
  }, [colorScheme, getWarpedPoint, globalColor])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const setSize = () => {
      canvas.width = root.clientWidth
      canvas.height = root.clientHeight
      sizeRef.current = { w: canvas.width, h: canvas.height }
      draw(performance.now())
    }

    setSize()
    const resizeObserver = new ResizeObserver(setSize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) draw(performance.now())
    })
    resizeObserver.observe(root)
    visibilityObserver.observe(root)

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [draw])

  return <div ref={rootRef} className={cn('relative min-h-screen w-full overflow-hidden', globalColor === 'monochrome' ? colorScheme === 'dark' ? 'bg-[#080a09]' : 'bg-white' : 'bg-[#161618]', className)}>
    <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true" />
    <div className="relative z-10 h-full w-full">{children}</div>
  </div>
}
