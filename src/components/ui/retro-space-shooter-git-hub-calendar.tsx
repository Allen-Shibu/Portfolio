import { memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type ContributionLevel = 0 | 1 | 2 | 3 | 4
export type ContributionData = Record<string, { level: ContributionLevel; label?: string; count?: number }>
export type ThemeColors = { level0: string; level1: string; level2: string; level3: string; level4: string }
export type CellShape = 'rounded' | 'circle'
export type GithubCalendarProps = {
  username?: string
  data?: ContributionData
  startDate?: string
  endDate?: string
  startsOnSunday?: boolean
  cellSize?: number
  cellGap?: number
  cellShape?: CellShape
  theme?: 'github' | ThemeColors
  showMonthLabels?: boolean
  showStats?: boolean
  showLegend?: boolean
  className?: string
}

const DARK: ThemeColors = { level0: '#f2f2f2', level1: '#d0d0d0', level2: '#999999', level3: '#555555', level4: '#111111' }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const parseDate = (value: string) => { const [year, month, day] = value.split('-').map(Number); return new Date(year, (month || 1) - 1, day || 1) }
const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next }

function buildGrid(startDate: string, endDate: string, startsOnSunday: boolean) {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  const offset = (start.getDay() - (startsOnSunday ? 0 : 1) + 7) % 7
  const gridStart = addDays(start, -offset)
  const weeks: (string | null)[][] = []
  const monthLabels: { label: string; weekIndex: number }[] = []
  let current = new Date(gridStart)
  let lastMonth = -1
  while (current <= end || weeks.length === 0) {
    const week: (string | null)[] = []
    for (let day = 0; day < 7; day++) {
      const value = formatDate(current)
      const inRange = current >= start && current <= end
      week.push(inRange ? value : null)
      if (inRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth()
        monthLabels.push({ label: MONTHS[lastMonth]!, weekIndex: weeks.length })
      }
      current = addDays(current, 1)
    }
    weeks.push(week)
  }
  return { weeks, monthLabels, gridStart: formatDate(gridStart) }
}

async function fetchContributions(username: string): Promise<ContributionData> {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
  if (!response.ok) throw new Error(`Could not load GitHub activity (${response.status})`)
  const json = await response.json() as { contributions: { date: string; count: number; level: number }[] }
  return Object.fromEntries(json.contributions.map((entry) => [entry.date, { count: entry.count, level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel }]))
}

function CalendarSkeleton({ cellSize, cellGap }: { cellSize: number; cellGap: number }) {
  return <div className="w-fit animate-pulse space-y-3 p-3"><div className="h-4 w-48 rounded bg-neutral-200" /><div className="h-28 w-[720px] max-w-full rounded bg-neutral-200" style={{ backgroundSize: `${cellSize + cellGap}px ${cellSize + cellGap}px` }} /></div>
}

export const GithubCalendar = memo(function GithubCalendar({ username, data: dataProp, startDate, endDate, startsOnSunday = true, cellSize = 12, cellGap = 3, cellShape = 'rounded', theme = 'github', showMonthLabels = true, showStats = true, showLegend = true, className }: GithubCalendarProps) {
  const id = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(Boolean(username))
  const [error, setError] = useState<string | null>(null)
  const [gameActive, setGameActive] = useState(false)

  useEffect(() => {
    if (!username) return
    let active = true
    setLoading(true)
    fetchContributions(username).then((result) => active && setFetchedData(result)).catch((reason) => active && setError(reason instanceof Error ? reason.message : String(reason))).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [username])

  const data = dataProp ?? fetchedData ?? {}
  const resolvedEnd = endDate ?? formatDate(new Date())
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate
    const date = parseDate(resolvedEnd)
    date.setFullYear(date.getFullYear() - 1)
    date.setDate(date.getDate() + 1)
    return formatDate(date)
  }, [startDate, resolvedEnd])
  const { weeks, monthLabels } = useMemo(() => buildGrid(resolvedStart, resolvedEnd, startsOnSunday), [resolvedStart, resolvedEnd, startsOnSunday])
  const colors = typeof theme === 'object' ? theme : DARK
  const step = cellSize + cellGap
  const labelHeight = showMonthLabels && !gameActive ? 20 : 0
  const svgWidth = weeks.length * step - cellGap
  const svgHeight = labelHeight + 7 * step - cellGap
  const cellRadius = cellShape === 'circle' ? cellSize / 2 : cellSize * .2
  const stats = useMemo(() => Object.values(data).reduce((result, entry) => ({ total: result.total + (entry.count ?? (entry.level ? 1 : 0)), activeDays: result.activeDays + (entry.level ? 1 : 0) }), { total: 0, activeDays: 0 }), [data])

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth }, [fetchedData, dataProp])

  useEffect(() => {
    if (!gameActive) {
      weeks.flat().forEach((date) => {
        if (!date) return
        const cell = document.getElementById(`cell-${id}-${date}`)
        const level = data[date]?.level ?? 0
        if (cell) {
          cell.style.opacity = '1'
          cell.setAttribute('fill', colors[`level${level}` as keyof ThemeColors])
          delete cell.dataset.destroyed
        }
      })
      return
    }
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const width = svgWidth
    const height = svgHeight + 72
    canvas.width = width
    canvas.height = height
    let frame = 0
    let playerX = width / 2
    let lastShot = 0
    let bullets: { x: number; y: number; hit?: boolean }[] = []
    const cellLevels = new Map<string, number>()
    weeks.forEach((week) => week.forEach((date) => {
      if (!date) return
      const level = data[date]?.level ?? 0
      cellLevels.set(date, level)
      const cell = document.getElementById(`cell-${id}-${date}`)
      if (cell) {
        cell.style.opacity = level > 0 ? '1' : '0'
        cell.style.transition = 'opacity 100ms ease'
      }
    }))
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random() * width, y: Math.random() * height, speed: Math.random() * .35 + .1 }))
    const startedAt = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = (now: number) => {
      if (!reduceMotion) playerX = 22 + (width - 44) * (.5 + .5 * Math.sin((now - startedAt) / 1100))
      if (!reduceMotion && now - lastShot > 180) { bullets.push({ x: playerX, y: height - 42 }); lastShot = now }
      context.clearRect(0, 0, width, height)
      context.fillStyle = 'rgba(0,0,0,.3)'
      stars.forEach((star) => { star.y += star.speed; if (star.y > height) star.y = 0; context.fillRect(star.x, star.y, 1, 1) })
      context.fillStyle = '#111111'
      bullets.forEach((bullet) => {
        bullet.y -= 6
        context.fillRect(bullet.x - 1.5, bullet.y, 3, 8)
        collision: for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
          for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = weeks[weekIndex][dayIndex]
            if (!date || (cellLevels.get(date) ?? 0) === 0) continue
            const cellX = weekIndex * step
            const cellY = dayIndex * step
            if (bullet.x + 1.5 < cellX || bullet.x - 1.5 > cellX + cellSize || bullet.y + 8 < cellY || bullet.y > cellY + cellSize) continue
            const nextLevel = (cellLevels.get(date) ?? 1) - 1
            cellLevels.set(date, nextLevel)
            const cell = document.getElementById(`cell-${id}-${date}`)
            if (cell) {
              if (nextLevel === 0) {
                cell.style.opacity = '0'
                cell.dataset.destroyed = 'true'
              } else cell.setAttribute('fill', colors[`level${nextLevel}` as keyof ThemeColors])
            }
            bullet.hit = true
            break collision
          }
        }
      })
      bullets = bullets.filter((bullet) => !bullet.hit && bullet.y > -10)

      context.save()
      context.translate(playerX, height - 17)
      context.shadowColor = '#111111'; context.shadowBlur = 9
      context.fillStyle = '#111111'
      context.beginPath(); context.moveTo(0, -20); context.lineTo(7, -7); context.lineTo(18, 4); context.lineTo(8, 2); context.lineTo(5, 10); context.lineTo(-5, 10); context.lineTo(-8, 2); context.lineTo(-18, 4); context.lineTo(-7, -7); context.closePath(); context.fill()
      context.shadowBlur = 0
      context.fillStyle = '#f5f5f5'; context.beginPath(); context.moveTo(0, -14); context.lineTo(4, -5); context.lineTo(-4, -5); context.closePath(); context.fill()
      context.fillStyle = '#777777'; context.fillRect(-5, 10, 3, 5); context.fillRect(2, 10, 3, 5)
      context.restore()
      if (!reduceMotion) frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [cellSize, colors, data, gameActive, id, step, svgHeight, svgWidth, weeks])

  if (loading) return <CalendarSkeleton cellSize={cellSize} cellGap={cellGap} />
  if (error) return <div className={cn('rounded-md border border-neutral-400 bg-white px-4 py-3 text-sm text-black', className)}>{error}</div>

  return <div className={cn('w-fit max-w-full overflow-hidden rounded-sm border border-neutral-300 bg-white text-neutral-900 shadow-sm', className)}>
    <div className="flex w-fit max-w-full flex-col gap-3 p-3">
      <div ref={scrollRef} className={cn('relative max-w-full overflow-x-auto', gameActive && 'pb-[72px]')} style={{ scrollbarWidth: 'none' }}>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
          {showMonthLabels && !gameActive && monthLabels.map(({ label, weekIndex }) => <text key={`${label}-${weekIndex}`} x={weekIndex * step} y={12} fontSize={11} fill="#111111">{label}</text>)}
          {weeks.map((week, weekIndex) => week.map((date, dayIndex) => {
            if (!date) return null
            const entry = data[date]
            const level = entry?.level ?? 0
            return <rect key={`${weekIndex}-${dayIndex}`} id={`cell-${id}-${date}`} x={weekIndex * step} y={labelHeight + dayIndex * step} width={cellSize} height={cellSize} rx={cellRadius} fill={colors[`level${level}` as keyof ThemeColors]} />
          }))}
        </svg>
        {gameActive && <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" style={{ width: svgWidth, height: svgHeight + 72 }} aria-label="Retro contribution shooter game" />}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {showLegend && <div className="flex items-center gap-2"><span>Less</span>{([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => <svg key={level} width={cellSize} height={cellSize}><rect width={cellSize} height={cellSize} rx={cellRadius} fill={colors[`level${level}` as keyof ThemeColors]} /></svg>)}<span>More</span></div>}
        <div className="flex items-center gap-2 border-l border-neutral-300 pl-3"><span>Game mode</span><button type="button" aria-pressed={gameActive} aria-label="Toggle retro shooter game" onClick={() => setGameActive((active) => !active)} className={cn('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-black/20 transition-colors duration-200', gameActive ? 'bg-black' : 'bg-neutral-300')}><span className={cn('absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200', gameActive ? 'translate-x-4' : 'translate-x-0')} /></button></div>
        {showStats && username && <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="ml-auto whitespace-nowrap font-medium text-neutral-600"><b className="text-black">{username}</b> · <strong className="text-black">{stats.total.toLocaleString()}</strong> contributions</a>}
      </div>
    </div>
  </div>
})

GithubCalendar.displayName = 'GithubCalendar'
export default GithubCalendar
