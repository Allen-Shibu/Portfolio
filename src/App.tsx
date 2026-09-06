import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Github from '@thesvg/react/github'
import Gmail2026 from '@thesvg/react/gmail-2026'
import Linkedin from '@thesvg/react/linkedin'
import XFormerlyTwitter from '@thesvg/react/x-formerly-twitter'
import Aws from '@thesvg/react/aws'
import Blender from '@thesvg/react/blender'
import Css3 from '@thesvg/react/css3'
import Git from '@thesvg/react/git'
import GoIcon from '@thesvg/react/go'
import GoogleColab from '@thesvg/react/google-colab'
import Html5 from '@thesvg/react/html5'
import Javascript from '@thesvg/react/javascript'
import Linux from '@thesvg/react/linux'
import Postgresql from '@thesvg/react/postgresql'
import Postman from '@thesvg/react/postman'
import Python from '@thesvg/react/python'
import Render from '@thesvg/react/render'
import Supabase from '@thesvg/react/supabase'
import ReactLogo from '@thesvg/react/react'
import Typescript from '@thesvg/react/typescript'
import VisualStudioCode from '@thesvg/react/visual-studio-code'
import Vercel from '@thesvg/react/vercel'
import KineticGrid from '@/components/ui/kinetic-grid'
import GithubCalendar from '@/components/ui/retro-space-shooter-git-hub-calendar'

const contactLinks = [
  ['LinkedIn', 'https://www.linkedin.com/in/allenshibu-as/'],
  ['GitHub', 'https://github.com/Allen-Shibu'],
  ['X', 'https://x.com/AllenShibu'],
  ['Gmail', 'mailto:allenshibukuriakose@gmail.com'],
] as const
const techStack = [
  ['Go', <GoIcon />],
  ['Python', <Python />],
  ['JavaScript', <Javascript />],
  ['TypeScript', <Typescript />],
  ['HTML', <Html5 />],
  ['CSS', <Css3 />],
  ['React', <ReactLogo />],
  ['PostgreSQL', <Postgresql />],
  ['Supabase', <Supabase />],
  ['AWS', <Aws variant="icon" />],
  ['Vercel', <Vercel variant="light" />],
  ['Render', <Render />],
  ['Linux', <Linux />],
  ['Git', <Git />],
  ['GitHub', <Github variant="light" />],
  ['VS Code', <VisualStudioCode />],
  ['Google Colab', <GoogleColab />],
  ['Postman', <Postman />],
  ['Blender', <Blender />],
] as const
const projects = [
  { name: 'Haritha Sethu', kind: 'Civic remote sensing', copy: 'An Axter Labs product turning Earth observation data into local environmental intelligence for Kerala gram panchayats.', stack: 'Earth Engine · PostGIS · Remote sensing · AI', href: 'https://github.com/Allen-Shibu/HarithaSethu', action: 'View repository', image: '/harithasethu.jpeg' },
  { name: 'OpenOrbit', kind: 'Campus infrastructure', copy: 'Event discovery and registration across campuses, with a no-code form builder and payments. Shipped to 100+ active users.', stack: 'React 19 · Go/Gin · Neon · Razorpay', href: 'https://openorbit.app/', action: 'Open product', image: '/openorbit.jpeg' },
  { name: 'ACPIA', kind: 'Investigation agent', copy: 'A CLI assistant for child-protection investigations with isolated evidence, cross-case correlation, and citation-first answers.', stack: 'Python · Gemma 3 Vision · Qwen 2.5', href: 'https://github.com/Allen-Shibu/ACPIA', action: 'View repository' },
  { name: 'CLARA', kind: 'Agentic due diligence', copy: 'Drop a company name. An agentic research loop checks whether the business behind it holds up.', stack: 'Go/Gin · Serper · OpenRouter', href: 'https://cla-ra.vercel.app/', action: 'Open product' },
]

const navItems = [['now', 'Now'], ['work', 'What I do'], ['projects', 'Projects'], ['contact', 'Connect']]
const roles = [
  ['Co-founder — Axter Labs', 'Leading product and engineering for Haritha Sethu, a civic remote-sensing product built for local decision-making.'],
  ['AWS Student Builders Group Leader', 'Selected to lead and grow Kerala’s third AWS student community.'],
  ['Tech Co-Lead — Arch AI Club', 'Co-leading a community of AI and cloud enthusiasts who discuss, experiment, and build with AI.'],
  ['B.Tech Computer Science, GECT', 'Second-year student at Government Engineering College Thrissur, started in 2025.'],
  ['Direction', 'Remote sensing, ambitious product engineering, and fintech-grade systems.'],
]
const capabilities = [
  ['Product engineering', 'I take products from idea through backend, interface, deployment, and testing.', 'OpenOrbit', ['IDEA → SHIP', 'BACKEND', 'INTERFACE', 'TESTING']],
  ['AI systems', 'I build agents, evidence-grounded reasoning, automation, and vision workflows.', 'ACPIA · CLARA', ['AGENTS', 'EVIDENCE', 'AUTOMATION', 'VISION']],
  ['Geospatial intelligence', 'I work with Earth Engine, PostGIS, remote-sensing indices, SAR, and foundation models.', 'Haritha Sethu', ['EARTH ENGINE', 'POSTGIS', 'SAR', 'FOUNDATION MODELS']],
  ['Cloud infrastructure', 'Building toward production-grade cloud systems — currently AWS-focused, SimuLearn certified.', 'AWS-focused · SimuLearn certified', ['AWS', 'CLOUD SYSTEMS', 'SIMULEARN', 'PRODUCTION DIRECTION']],
]
const capabilitySteps = [['IDEA', 'SHIP'], ['REASON', 'ACT'], ['PIXEL', 'SIGNAL'], ['LEARN', 'SCALE']]
const credibility = [
  ['AWS Student Builders Group Leader', 'Selected to lead Kerala’s third AWS student community.'],
  ['AWS SimuLearn', 'Generative AI Practitioner certification.'],
  ['Solve4Public Lab 1.0', 'Selected and successfully demonstrated Haritha Sethu.'],
  ['Axter Labs', 'Co-founder.'],
  ['OpenOrbit', 'Verified 100+ active users.'],
]
const hackathons = [
  ['CN', 'Codex Nightline', 'July 18, 2026 · Kochi, Kerala', 'World’s first AI hackathon inside a moving Kochi Metro train. Selected as 1 of 100 builders from 1,200+ registrations for a solo overnight build sprint.', '/hackathon/codex-icon.webp', 'https://www.codexnightline.in/#builder-selection'],
  ['S4P', 'Solve4Public Lab 1.0', 'Late July – August 1, 2026 · Chakkittapara, Kozhikode, Kerala', 'A 3-day fully-funded program by TinkerHub & The Ignite Foundation. Co-built Haritha Sethu, a satellite-based environmental monitoring platform for Panchayats, working directly with local officials.'],
  ['L:67', 'Localhost:6767 (Supermemory Hackathon)', 'July 9–13, 2026 · Online', 'Supermemory’s first-ever hackathon. Built ACPIA, a CLI AI agent that turns digital evidence into cited, human-reviewable leads for child-protection cases.', '/hackathon/supermemory.jpeg'],
  ['BMWI', 'Build What Moves India', 'August 2026 · Online (Finale: Sept 12, Bengaluru)', 'OpenAI × Varun Mayya civic-tech hackathon to reimagine India’s public service websites. Built RefundSaathi to help businesses track pending GST refunds.', undefined, 'https://buildwhatmovesindia.com/'],
]
const journalItems = [
  ['/gallery/codex.jpeg', 'Allen at Codex Nightline'],
  ['/gallery/codex1.jpeg', 'Builders at Codex Nightline'],
  ['/gallery/codex2.jpeg', 'Building during Codex Nightline'],
  ['/gallery/hs.jpeg', 'The Haritha Sethu team'],
  ['/gallery/hs1.jpeg', 'Haritha Sethu field work'],
] as const

const clamp = (value: number) => Math.min(1, Math.max(0, value))

function useScrollCraft() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      document.documentElement.style.setProperty('--page-progress', String(window.scrollY / Math.max(1, document.documentElement.scrollHeight - viewport)))
      document.querySelectorAll<HTMLElement>('[data-scroll-section]').forEach((section) => {
        const rect = section.getBoundingClientRect()
        const progress = clamp(-rect.top / Math.max(1, rect.height - viewport))
        section.style.setProperty('--section-progress', String(progress))
        const track = section.querySelector<HTMLElement>('[data-horizontal-track]')
        if (track && !reduceMotion.matches && window.innerWidth >= 768) track.style.transform = `translate3d(${-progress * Math.max(0, track.scrollWidth - window.innerWidth)}px, 0, 0)`
        else if (track) track.style.transform = ''
      })
    }
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reduceMotion.addEventListener('change', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reduceMotion.removeEventListener('change', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none"><path d={diagonal ? 'M5 15 15 5M7 5h8v8' : 'M3 10h14m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function ContactLinks({ compact = false }: { compact?: boolean }) {
  return <div className={`connect-links ${compact ? 'connect-links--compact' : ''}`}>{contactLinks.map(([label, href]) => <a key={label} className="pressable" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}>{label}<Arrow diagonal /></a>)}</div>
}

function ContactGlyph({ label }: { label: string }) {
  if (label === 'LinkedIn') return <Linkedin className="h-6 w-6" aria-hidden="true" />
  if (label === 'GitHub') return <Github variant="dark" className="h-6 w-6" aria-hidden="true" />
  if (label === 'Gmail') return <Gmail2026 className="h-6 w-6" aria-hidden="true" />
  return <XFormerlyTwitter className="h-6 w-6" aria-hidden="true" />
}

function HeaderContactLinks() {
  return <nav className="header-connect" aria-label="Social links">{contactLinks.map(([label, href]) => <a key={label} className="header-social pressable" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} aria-label={`Open ${label}`} title={label}><ContactGlyph label={label} /></a>)}</nav>
}

function HeroPortrait() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.figure className="hero-portrait" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
      <motion.img src="/pfp_site_bg.png" alt="Portrait of Allen Shibu" initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }} />
    </motion.figure>
  )
}

function Header({ active }: { active: string }) {
  return <><a href="#main" className="skip-link">Skip to content</a><header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"><div className="glass mx-auto flex h-14 max-w-[1440px] items-center justify-between rounded-2xl px-3 pl-4 sm:px-5"><a href="#top" className="brand-name pressable" aria-label="Allen Shibu, back to top">Allen Shibu</a><nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className="nav-link" aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav><HeaderContactLinks /></div></header></>
}

function ProgressRail({ active }: { active: string }) {
  return <nav className={`progress-rail ${active === 'projects' ? 'progress-rail--light' : ''}`} aria-label="Personal trajectory"><div className="progress-line"><span /></div><a href="#top" aria-label="Start" aria-current={active === 'top' ? 'location' : undefined}><span className="progress-dot" /><span className="progress-label">Start</span></a>{navItems.map(([id, label]) => <a key={id} href={`#${id}`} aria-label={label} aria-current={active === id ? 'location' : undefined}><span className="progress-dot" /><span className="progress-label">{id === 'now' ? 'NOW / 2026' : label}</span></a>)}</nav>
}

function Hero() {
  return <section id="top" data-scroll-section className="hero-scroll"><div className="hero-sticky"><KineticGrid className="hero-grid" globalColor="monochrome"><HeroPortrait /><div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:items-center lg:px-16"><div className="max-w-[1050px]"><p className="kicker hero-enter">Allen Shibu · Kerala, India</p><h1 className="hero-title hero-enter">I build technology for <span>problems that matter.</span></h1><p className="hero-position hero-enter">Product builder · Co-founder, Axter Labs · AWS Student Builders Group Leader.</p><p className="hero-copy hero-enter">Selected to lead Kerala’s third AWS student community. Second-year computer science student at GECT, working toward remote sensing and high-trust engineering.</p></div></div><div className="hero-index" aria-hidden="true"><span>TRAJECTORY</span><b>01</b></div></KineticGrid></div></section>
}

function RightNow() {
  return <section id="now" data-scroll-section data-observe className="now-scroll"><div className="now-sticky"><div className="now-heading"><p className="kicker">Right now</p><h2>Where the work is <em>pointing.</em></h2></div><div className="now-marker" aria-hidden="true"><span>NOW</span><b>2026</b></div><ol className="role-list">{roles.map(([title, copy], index) => <li key={title} style={{ '--role-index': index } as React.CSSProperties}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></section>
}

function Work() {
  return <section id="work" data-observe className="work-section"><div className="work-intro reveal-in"><p className="kicker">What I do</p><h2 className="section-display">Four disciplines.<br /><em>One builder.</em></h2><p>Ideas matter when they survive the distance from first sketch to a dependable system.</p></div><div className="capability-features">{capabilities.map(([title, copy, proof, tags], index) => <article key={title as string} className="capability-feature reveal-in"><div className="feature-visual" aria-hidden="true"><span>0{index + 1}</span><b className="feature-step"><span>{capabilitySteps[index][0]}</span><Arrow /><span>{capabilitySteps[index][1]}</span></b></div><div className="feature-copy"><p className="kicker">Feature — 0{index + 1}{index === 3 ? ' · What’s next' : ''}</p><h3>{title as string}</h3><p>{copy as string}</p><div className="feature-tags">{(tags as string[]).map((tag) => <span key={tag}>{tag}</span>)}</div><small>{index === 3 ? `Trajectory — ${proof as string}` : `Proof — ${proof as string}`}</small></div></article>)}</div></section>
}

function TechStack() {
  return <section data-observe className="tech-stack-section"><div className="tech-stack-inner reveal-in"><p className="kicker">Tech stack &amp; ecosystem</p><ul aria-label="Technologies I use">{techStack.map(([name, icon]) => <li key={name}>{icon}<span>{name}</span></li>)}</ul><small>Icons by <a href="https://thesvg.org/" target="_blank" rel="noreferrer">theSVG</a></small></div></section>
}

function Projects() {
  return <section id="projects" data-scroll-section data-observe className="project-scroll"><div className="project-sticky"><div className="project-track" data-horizontal-track><div className="project-lead"><p className="kicker">Selected builds</p><h2>One person.<br />Four directions.</h2><p>Real products, constrained users, working backends. Scroll to walk the index.</p></div>{projects.map((project, index) => <article className="project-card" key={project.name}><div className="project-number">0{index + 1}</div><p className="kicker">{project.kind}</p><h3>{project.name}</h3><p className="project-copy">{project.copy}</p>{'image' in project && <img className="project-image" src={project.image} alt={`${project.name} product interface`} decoding="async" />}<div className="project-footer"><span>{project.stack}</span><a className="round-link pressable" href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.action}: ${project.name}`}><Arrow diagonal /></a></div></article>)}<div className="project-outro"><p>The common thread</p><h3>I stay with the problem until it becomes usable.</h3></div></div></div></section>
}

function Hackathons() {
  return (
    <section id="hackathons" data-observe className="hackathons-section">
      <div className="hackathons-inner">
        <header className="hackathons-header reveal-in">
          <div className="hackathons-label"><span>Hackathons</span></div>
          <h2>I like building things</h2>
          <p>Hackathons I have participated in so far—short, focused sprints where ideas have to become something real.</p>
        </header>
        <ol className="hackathon-list">
          {hackathons.map(([mark, name, date, copy, image, href]) => (
            <li key={name} className="reveal-in">
              <span className="hackathon-mark" aria-hidden="true">{image ? <img src={image} alt="" /> : mark}</span>
              <div><small>{date}</small><h3>{href ? <a href={href} target="_blank" rel="noreferrer">{name}<Arrow diagonal /></a> : name}</h3><p>{copy}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Credibility() {
  return <section data-observe className="credibility-section"><div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-16 lg:py-40"><div className="credibility-intro reveal-in"><p className="kicker">Signals, not claims</p><h2 className="section-display">Momentum with<br /><em>receipts.</em></h2></div><ol className="credibility-list">{credibility.map(([title, copy], index) => <li key={title} className="reveal-in"><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
}

function GithubActivity() {
  return <section className="github-activity"><div className="github-activity-inner"><div className="github-activity-copy"><p className="kicker">Building, most days.</p><h2 className="section-display">A record of<br /><em>building.</em></h2><p>Recent building activity, translated into a small playable surface.</p></div><GithubCalendar username="Allen-Shibu" cellSize={16} cellGap={4} className="github-calendar-feature" /></div></section>
}

function Journal() {
  return <section id="journal" data-scroll-section className="journal-scroll"><div className="journal-sticky"><header className="journal-heading"><p className="kicker">Beyond the commits</p><h2>Journal &amp; Insights</h2><p>Field notes, communities, experiments, and the people behind the work.</p></header><div id="journal-grid" className="journal-grid">{journalItems.map(([src, alt], index) => <figure key={src} className={`journal-card journal-card--${index + 1}`}><img src={src} alt={alt} loading="lazy" decoding="async" />{journalItems.length > 5 && index === 2 && <figcaption>View gallery <Arrow diagonal /></figcaption>}</figure>)}</div></div></section>
}

function Contact() {
  return <section id="contact" data-scroll-section data-observe className="contact-scroll"><div className="contact-sticky"><div className="closing-kinetic" aria-hidden="true"><span>THINK</span><span>BUILD</span><span>SHIP</span></div><div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 lg:px-16"><p className="kicker">What comes next</p><div className="max-w-5xl"><h2>To infinity<br /><span>and beyond!</span></h2><ContactLinks /></div><footer className="site-footer"><div><span>Allen Shibu · Kerala, India</span><span>Co-founder, Axter Labs · 2026</span></div><nav className="footer-connect" aria-label="Connect with me"><span>Connect with me</span><ContactLinks compact /></nav></footer></div></div></section>
}

export default function App() {
  const [active, setActive] = useState('top')
  useScrollCraft()
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('#top, #now, #work, #projects, #contact')]
    const update = () => {
      let current = 'top'
      sections.forEach((section) => { if (section.getBoundingClientRect().top <= innerHeight / 2) current = section.id })
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: 0.16 })
    document.querySelectorAll('.reveal-in').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return <><Header active={active} /><ProgressRail active={active} /><main id="main"><Hero /><RightNow /><Work /><TechStack /><Projects /><Hackathons /><Credibility /><GithubActivity /><Journal /><Contact /></main></>
}
