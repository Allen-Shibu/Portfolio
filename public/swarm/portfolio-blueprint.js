// Map the official Swarm task types onto the portfolio DOM.
window.portfolioBlueprint = () => {
  const els = []
  const tasks = []
  const groups = []
  const bindings = []
  let nextId = 0

  const boundsFor = (node) => {
    const bounds = node.getBoundingClientRect()
    return { x: bounds.left, y: bounds.top + window.scrollY, w: bounds.width, h: bounds.height }
  }

  const addGuide = (sectionId, axis, node) => {
    const bounds = boundsFor(node)
    const id = `${sectionId}-guide-${axis}`
    const pos = axis === 'x' ? bounds.x : bounds.y
    const taskId = `g:${id}`
    els.push({ kind: 'guide', id, v: 0, vis: false, axis, pos, cur: pos, op: 0, dragging: false, flash: 0 })
    tasks.push({ id: taskId, y: bounds.y, spec: { type: 'guide', el: id }, deps: [] })
    bindings.push({ id, node, taskId, kind: 'guide', axis })
    return taskId
  }

  const addText = (node, guideId, deps) => {
    const bounds = boundsFor(node)
    if (!bounds.w || !bounds.h) return
    const computed = getComputedStyle(node)
    const size = parseFloat(computed.fontSize) || 16
    const lineHeight = parseFloat(computed.lineHeight)
    const letterSpacing = parseFloat(computed.letterSpacing)
    const id = `text-${nextId++}`
    const taskId = `t:${id}`
    els.push({
      kind: 'text', id, v: 0, vis: false, dx: 0, dy: 0,
      x: bounds.x, y: bounds.y, w: bounds.w, text: node.innerText.trim(), shown: '',
      size, align: computed.textAlign, editing: false, selAll: false,
      st: {
        font: computed.fontFamily.toLowerCase().includes('mono') ? 'mono' : 'sans',
        size, weight: Number(computed.fontWeight) || 400,
        lh: Number.isFinite(lineHeight) ? lineHeight / size : 1.25,
        color: computed.color,
        ls: Number.isFinite(letterSpacing) ? letterSpacing / size : 0,
        pre: false,
      },
    })
    node.classList.add('swarm-typing-source')
    tasks.push({ id: taskId, y: bounds.y, spec: { type: 'text', el: id, snap: guideId }, deps })
    bindings.push({ id, node, taskId, kind: 'text' })
  }

  const addRect = (node, deps, id = `rect-${nextId++}`, schedule = true) => {
    const bounds = boundsFor(node)
    if (!bounds.w || !bounds.h) return null
    node.classList.add('swarm-build-source')
    els.push({ kind: 'rect', id, v: 0, vis: false, dx: 0, dy: 0, ...bounds, r: 0, fill: 'transparent', stroke: 'transparent', draw: null, styled: false })
    const taskId = `r:${id}`
    if (schedule) tasks.push({ id: taskId, y: bounds.y, spec: { type: 'rect', el: id }, deps })
    bindings.push({ id, node, taskId: schedule ? taskId : null, kind: 'rect' })
    return { id, taskId, bounds }
  }

  const addDuplicateGroup = (sectionId, nodes, deps) => {
    if (nodes.length < 2) return
    const base = addRect(nodes[0], deps, `${sectionId}-base`)
    if (!base) return
    const copies = nodes.slice(1).map((node, index) => {
      const copy = addRect(node, [], `${sectionId}-copy-${index}`, false)
      if (!copy) return null
      const taskId = `d:${sectionId}:${index}`
      const dx = copy.bounds.x - base.bounds.x
      const dy = copy.bounds.y - base.bounds.y
      tasks.push({ id: taskId, y: copy.bounds.y, spec: { type: 'dup', group: sectionId, k: index }, deps: [base.taskId] })
      const binding = bindings.find((item) => item.id === copy.id)
      if (binding) binding.taskId = taskId
      return { dx, dy, ids: [copy.id] }
    }).filter(Boolean)
    groups.push({ id: sectionId, ids: [base.id], copies })
  }

  const sectionSpecs = [
    { id: 'hero', root: '#top', anchor: '.hero-title', text: ['.hero-title', '.hero-position'], rect: ['.hero-portrait'] },
    { id: 'roles', root: '#now', anchor: '.now-heading h2', text: ['.now-heading h2', '.role-list h3', '.role-list p'], duplicate: '.role-list li' },
    { id: 'stack', root: '.tech-stack-section', anchor: '.tech-stack-title', text: ['.tech-stack-title', '.tech-stack-inner > small'], duplicate: '.tech-stack-inner li' },
    { id: 'projects', root: '#projects', anchor: '.project-heading h2', text: ['.project-heading h2', '.project-heading p'], rect: ['.project-panel'], duplicate: '.project-tabs button' },
    { id: 'hackathons', root: '#hackathons', anchor: '.hackathons-header h2', text: ['.hackathons-header h2', '.hackathons-header p', '.hackathon-list small', '.hackathon-list h3', '.hackathon-list p'], duplicate: '.hackathon-list li' },
    { id: 'credibility', root: '.credibility-section', anchor: '.credibility-intro h2', text: ['.credibility-intro h2', '.credibility-list h3', '.credibility-list p'], duplicate: '.credibility-list li' },
    { id: 'activity', root: '.github-activity', anchor: '.github-activity-copy h2', text: ['.github-activity-copy h2', '.github-activity-copy > p'], rect: ['.github-calendar-build'] },
    { id: 'journal', root: '#gallery', anchor: '.journal-heading h2', text: ['.journal-heading h2', '.journal-heading p'], duplicate: '.journal-card' },
    { id: 'contact', root: '#contact', anchor: '.contact-sticky h2', text: ['.contact-sticky h2', '.closing-kinetic span', '.site-footer > div span'], duplicate: ['.contact-sticky .connect-links:not(.connect-links--compact) a', '.connect-links--compact a'] },
  ]

  sectionSpecs.forEach((spec) => {
    const root = document.querySelector(spec.root)
    const anchor = root?.querySelector(spec.anchor)
    if (!root || !anchor) return
    const guideX = `${spec.id}-guide-x`
    const deps = [addGuide(spec.id, 'x', anchor), addGuide(spec.id, 'y', anchor)]
    spec.text.flatMap((selector) => [...root.querySelectorAll(selector)]).forEach((node) => addText(node, guideX, deps))
    spec.rect?.flatMap((selector) => [...root.querySelectorAll(selector)]).forEach((node) => addRect(node, deps))
    if (spec.duplicate) (Array.isArray(spec.duplicate) ? spec.duplicate : [spec.duplicate]).forEach((selector, index) => addDuplicateGroup(`${spec.id}-${index}`, [...root.querySelectorAll(selector)], deps))
  })

  window.portfolioSwarmBindings = bindings
  return { els, tasks, groups, height: document.documentElement.scrollHeight }
}
