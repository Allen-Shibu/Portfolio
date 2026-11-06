let portfolioSwarmEngine
new ResizeObserver(() => {
  if (portfolioSwarmEngine) portfolioSwarmEngine.height = document.documentElement.scrollHeight
}).observe(document.body)

// Keep active Swarm targets on their live DOM elements, including sticky sections.
window.syncPortfolioSwarm = (engine) => {
  portfolioSwarmEngine = engine
  let textLayer = document.querySelector('.swarm-text-layer')
  if (!textLayer) {
    textLayer = document.createElement('div')
    textLayer.className = 'swarm-text-layer'
    textLayer.setAttribute('aria-hidden', 'true')
    document.body.append(textLayer)
  }
  window.portfolioSwarmBindings?.forEach((binding) => {
    const element = engine.els.get(binding.id)
    const task = binding.taskId ? engine.byTask.get(binding.taskId) : null
    if (!element) return
    const done = task?.state === 'done'

    if (binding.kind === 'text') {
      binding.node.classList.toggle('swarm-task-done', done)
      if (done && binding.generated) binding.generated.hidden = true
    }
    if (binding.kind === 'rect') {
      binding.node.classList.toggle('swarm-built-source', done)
      if (done && binding.generated) binding.generated.hidden = true
    }
    if (!task || task.state === 'wait' || done) return

    const bounds = binding.node.getBoundingClientRect()
    const y = bounds.top + window.scrollY

    if (binding.kind === 'guide') {
      const pos = binding.axis === 'x' ? bounds.left : y
      element.pos = pos
      if (!element.dragging) element.cur = pos
    } else {
      element.x = bounds.left
      element.y = y
      element.w = bounds.width
      if (binding.kind === 'rect') element.h = bounds.height
    }

    if (binding.kind === 'text') {
      if (!binding.generated) {
        const computed = getComputedStyle(binding.node)
        binding.generated = document.createElement('div')
        binding.generated.className = 'swarm-generated-text'
        Object.assign(binding.generated.style, {
          color: element.st.color,
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          fontStyle: computed.fontStyle,
          fontWeight: computed.fontWeight,
          letterSpacing: computed.letterSpacing,
          lineHeight: computed.lineHeight,
          textAlign: computed.textAlign,
          textTransform: computed.textTransform,
        })
        textLayer.append(binding.generated)
      }
      binding.generated.hidden = !element.vis
      binding.generated.textContent = element.shown
      binding.generated.style.left = `${bounds.left}px`
      binding.generated.style.top = `${y}px`
      binding.generated.style.width = `${bounds.width}px`
      binding.generated.classList.toggle('is-editing', Boolean(element.editing && !element.selAll))
      binding.generated.classList.toggle('is-selected', Boolean(element.selAll))
    }

    if (binding.kind === 'rect') {
      if (!binding.generated) {
        binding.generated = document.createElement('div')
        binding.generated.className = 'swarm-generated-rect'
        textLayer.append(binding.generated)
      }
      const width = element.draw?.w ?? element.w
      const height = element.draw?.h ?? element.h
      binding.generated.hidden = !(element.vis && task?.state === 'active')
      binding.generated.style.left = `${element.x + element.dx}px`
      binding.generated.style.top = `${element.y + element.dy}px`
      binding.generated.style.width = `${Math.max(0, width)}px`
      binding.generated.style.height = `${Math.max(0, height)}px`
      binding.generated.classList.toggle('is-styled', Boolean(element.styled))
    }
  })
}

// Let the cursors form up, then start building without waiting for scroll.
const startPortfolioSwarm = () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.swarm) setTimeout(() => window.swarm.start(), 250)
  else requestAnimationFrame(startPortfolioSwarm)
}
requestAnimationFrame(startPortfolioSwarm)
