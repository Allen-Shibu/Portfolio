import { expect, test } from 'playwright/test'

test('Swarm builds the portfolio before scroll, including projects', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm Allen Shibu")
  await expect(page.getByAltText('Portrait of Allen Shibu')).toHaveAttribute('src', '/pfp_site_bg.png')
  await expect.poll(() => page.evaluate(() => Boolean((window as typeof window & { swarm?: unknown }).swarm))).toBe(true)
  await expect.poll(() => page.evaluate(() => (window as typeof window & { swarm: { started: boolean } }).swarm.started)).toBe(true)
  await expect.poll(() => page.evaluate(() => {
    const engine = (window as typeof window & { swarm: { frontier: number; viewBot: number; vp: { vh: number; s: number } } }).swarm
    return (engine.frontier - engine.viewBot) / (engine.vp.vh / engine.vp.s)
  })).toBeLessThanOrEqual(.05)
  expect(await page.evaluate(() => {
    const target = window as typeof window & { portfolioSwarmBindings?: { node: Element; taskId?: string }[]; swarm: { byTask: Map<string, { state: string }> } }
    return (target.portfolioSwarmBindings ?? []).filter((binding) => binding.node.closest('#now')).every((binding) => !binding.taskId || target.swarm.byTask.get(binding.taskId)?.state === 'wait')
  })).toBe(true)
  await expect.poll(() => page.evaluate(() => (window as typeof window & { swarm: { tempo: number } }).swarm.tempo)).toBeGreaterThanOrEqual(3.1)
  await expect.poll(() => page.evaluate(() => (window as typeof window & { swarm: { tasks: { state: string; spec?: { type?: string } }[] } }).swarm.tasks.filter((task) => task.spec?.type === 'text' && task.state !== 'wait').length), { timeout: 10000 }).toBeGreaterThan(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveClass(/swarm-typing-source/)
  await expect.poll(() => page.locator('.swarm-generated-text').filter({ hasText: /Hi|Allen/ }).count(), { timeout: 10000 }).toBeGreaterThan(0)
  await expect.poll(() => page.locator('.swarm-generated-text').filter({ hasText: /Hi|Allen/ }).first().evaluate((node) => getComputedStyle(node).color)).not.toBe('rgba(0, 0, 0, 0)')
  await expect(page.locator('.github-calendar-build')).toHaveClass(/swarm-build-source/)
  await expect(page.locator('.github-calendar-build')).not.toHaveClass(/swarm-built-source/)
  await expect(page.locator('#projects .project-panel')).toHaveClass(/swarm-build-source/)
  await expect(page.locator('#projects .project-panel')).not.toHaveClass(/swarm-built-source/)

  const state = await page.evaluate(() => {
    const engine = (window as typeof window & { swarm: { tasks: { spec?: { type?: string } }[]; cursors: unknown[] } }).swarm
    return {
      tasks: engine.tasks.length,
      guideTasks: engine.tasks.filter((task) => task.spec?.type === 'guide').length,
      textTasks: engine.tasks.filter((task) => task.spec?.type === 'text').length,
      duplicateTasks: engine.tasks.filter((task) => task.spec?.type === 'dup').length,
      projectBindings: ((window as typeof window & { portfolioSwarmBindings?: { node: Element }[] }).portfolioSwarmBindings ?? []).filter((binding) => binding.node.closest('#projects')).length,
      cursors: engine.cursors.length,
      heroText: getComputedStyle(document.querySelector('.hero-enter')!).transform,
      roleText: getComputedStyle(document.querySelector('.role-list li')!).transform,
      journalText: getComputedStyle(document.querySelector('.journal-heading')!).transform,
    }
  })
  expect(state.tasks).toBeGreaterThan(80)
  expect(state.guideTasks).toBe(18)
  expect(state.textTasks).toBeGreaterThan(37)
  expect(state.duplicateTasks).toBeGreaterThan(28)
  expect(state.projectBindings).toBeGreaterThanOrEqual(8)
  expect(state.cursors).toBeGreaterThanOrEqual(18)
  expect(state.heroText).not.toBe('none')
  expect(state.roleText).toBe('none')
  expect(state.journalText).not.toBe('none')
  await expect.poll(() => page.getByRole('heading', { level: 1 }).evaluate((node) => node.classList.contains('swarm-task-done')), { timeout: 15000 }).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveCSS('opacity', '0')
  expect(await page.getByRole('heading', { level: 1 }).evaluate(async (node) => {
    let reads = 0
    const getBounds = node.getBoundingClientRect.bind(node)
    node.getBoundingClientRect = () => { reads += 1; return getBounds() }
    await new Promise((resolve) => setTimeout(resolve, 250))
    return reads
  })).toBe(0)

  const layout = await page.evaluate(() => ({
    hero: getComputedStyle(document.querySelector('.hero-sticky')!).position,
    roles: getComputedStyle(document.querySelector('.now-sticky')!).position,
    projects: getComputedStyle(document.querySelector('.project-section')!).position,
    journal: getComputedStyle(document.querySelector('.journal-sticky')!).position,
    projectPanel: getComputedStyle(document.querySelector('.project-panel')!).display,
    projectTrack: document.querySelector('[data-horizontal-track]'),
  }))
  expect(layout).toEqual({ hero: 'sticky', roles: 'relative', projects: 'static', journal: 'sticky', projectPanel: 'grid', projectTrack: null })
  await page.evaluate(() => window.scrollTo(0, 700))
  await expect.poll(() => page.evaluate(() => (window as typeof window & { swarm: { tasks: { state: string }[] } }).swarm.tasks.filter(task => task.state !== 'wait').length), { timeout: 10000 }).toBeGreaterThan(0)
  await expect.poll(() => page.locator('#swarm-root .cursor').count()).toBeGreaterThan(0)
  await expect(page.locator('#projects').getByRole('button', { name: /CLA-RA/ })).toBeAttached()
  await expect(page.getByRole('heading', { name: 'To infinity and beyond!' })).toBeAttached()
})

test('reduced motion uses the readable fallback and skips Swarm', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await page.evaluate(() => Boolean((window as typeof window & { swarm?: unknown }).swarm))).toBe(false)
  await page.close()
})
