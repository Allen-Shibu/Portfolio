import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Github from '@thesvg/react/github'
import Gmail2026 from '@thesvg/react/gmail-2026'
import Linkedin from '@thesvg/react/linkedin'
import Meta from '@thesvg/react/meta'
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
  ['Go', <GoIcon variant="mono" />],
  ['Python', <Python />],
  ['JavaScript', <Javascript />],
  ['TypeScript', <Typescript />],
  ['HTML', <Html5 />],
  ['CSS', <Css3 />],
  ['React', <ReactLogo />],
  ['PostgreSQL', <Postgresql />],
  ['Supabase', <Supabase />],
  ['AWS', <Aws className="aws-logo" />],
  ['Vercel', <Vercel variant="mono" />],
  ['Render', <Render variant="mono" />],
  ['Linux', <Linux />],
  ['Git', <Git />],
  ['GitHub', <Github variant="light" />],
  ['VS Code', <VisualStudioCode />],
  ['Google Colab', <GoogleColab />],
  ['Postman', <Postman />],
  ['Blender', <Blender />],
] as const
const projects = [
  { name: 'Haritha Sethu', copy: 'An Astrelon Labs product turning Earth observation data into local environmental intelligence for Kerala gram panchayats.', stack: 'Earth Engine · PostGIS · Remote sensing · AI', href: 'https://harithasethu.astrelonlabs.space/', action: 'Check Out', image: '/harithasethu.png' },
  { name: 'OpenOrbit', copy: 'Event discovery and registration across campuses, with a no-code form builder and payments. Shipped to 100+ active users.', stack: 'React 19 · Go/Gin · Neon · Razorpay', href: 'https://openorbit.app/', action: 'Open product', image: '/openorbit.jpeg' },
  { name: 'CLA-RA', copy: 'Drop a company name. An agentic research loop checks whether the business behind it holds up.', stack: 'Go/Gin · Serper · OpenRouter', href: 'https://cla-ra.vercel.app/', action: 'Open product', image: '/CLA-RA.png' },
]

const navItems = [['now', 'Now'], ['skills', 'Skills'], ['projects', 'Projects']]
const roles = [
  ['Co-founder — Astrelon Labs', 'Leading product and engineering for Haritha Sethu, a civic remote-sensing product built for local decision-making.'],
  ['AWS Student Builders Group Leader', 'Selected to lead and grow Kerala’s third AWS student community.'],
  ['B.Tech Computer Science, GECT', 'Second-year student at Government Engineering College Thrissur, started in 2025.'],
]
const credibility = [
  ['AWS SimuLearn', 'Generative AI Practitioner certification.', 'https://www.credly.com/badges/9d3fe6cc-28c8-4d49-9441-b533647c47d1/public_url'],
  ['AWS Student Builders Group Leader', 'Selected to lead Kerala’s third AWS student community.', 'https://www.credly.com/badges/2f256c90-d63a-4d4c-a23e-bc99b8c6c8a6/public_url'],
  ['Astrelon Labs', 'Co-founder.', 'https://www.linkedin.com/company/astrelon-labs/'],
  ['Kerala Startup Mission', 'Idea Box — Expert Evaluation. Received positive expert feedback through KSUM’s Idea Box Portal, with the idea recognized as promising and recommended for further development towards a Minimum Viable Product (MVP).'],
]
const hackathons = [
  ['META', 'Meta Global AI Developer Hackathon', 'October 26 – November 5, 2026 · Online', 'A 10-day global build sprint using Meta Model API, Muse Code, and open-weight models, with technical workshops from Meta Superintelligence Labs.', undefined, 'https://developers.meta.com/blog/meta-connect-recap/'],
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
  ['/gallery/aws.jpeg', 'Allen speaking at the AWS Student Builder Group kickoff'],
  ['/gallery/aws_group.jpeg', 'AWS Student Builder Group kickoff attendees'],
  ['/gallery/kph.jpeg', 'Allen at KPH Hackathon 2026'],
  ['/gallery/kph_!.jpeg', 'Team selfie at KPH Hackathon 2026'],
  ['/gallery/kph_group.jpeg', 'Builders at KPH Hackathon 2026'],
  ['/gallery/kph_with_thomson.jpeg', 'Allen and Thomson at KPH Hackathon 2026'],
] as const
type Theme = 'light' | 'dark'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

function useScrollCraft() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      document.querySelectorAll<HTMLElement>('[data-scroll-section]').forEach((section) => {
        const rect = section.getBoundingClientRect()
        const progress = clamp(-rect.top / Math.max(1, rect.height - viewport))
        section.style.setProperty('--section-progress', String(progress))
      })
    }
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
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

function ContactGlyph({ label, darkSurface = false }: { label: string; darkSurface?: boolean }) {
  if (label === 'LinkedIn') return <Linkedin className="h-6 w-6" aria-hidden="true" />
  if (label === 'GitHub') return <Github variant={darkSurface ? 'dark' : 'light'} className="h-6 w-6" aria-hidden="true" />
  if (label === 'Gmail') return <Gmail2026 className="h-6 w-6" aria-hidden="true" />
  return <XFormerlyTwitter className="h-6 w-6" aria-hidden="true" />
}

function HeaderContactLinks({ darkSurface = false }: { darkSurface?: boolean }) {
  return <nav className="header-connect" aria-label="Social links">{contactLinks.map(([label, href]) => <a key={label} className="header-social pressable" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} aria-label={`Open ${label}`} data-tooltip={label}><ContactGlyph label={label} darkSurface={darkSurface} /></a>)}</nav>
}

function DockGlyph({ id }: { id: string }) {
  const path = id === 'top' ? 'M3 10 10 3l7 7v7H6v-7m3 7v-5h2v5'
    : id === 'now' ? 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 3v4l3 2'
      : id === 'skills' ? 'M6 5 3 10l3 5m8-10 3 5-3 5M12 3 8 17'
        : id === 'projects' ? 'M3 3h5v5H3V3Zm9 0h5v5h-5V3ZM3 12h5v5H3v-5Zm9 0h5v5h-5v-5Z'
          : id === 'proof' ? 'M4 10.5 8 14l8-9M10 3a7 7 0 1 0 7 7'
            : id === 'gallery' ? 'M3 4h14v12H3V4Zm2 9 3-3 2 2 2-2 3 3M13 7h.01'
              : 'M3 5h14v10H3V5Zm1 1 6 5 6-5'
  return <svg className="dock-glyph" viewBox="0 0 20 20" aria-hidden="true" fill="none"><path d={path} stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function HeroPortrait() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.figure className="hero-portrait" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
      <motion.img src="/pfp_site_bg.png" alt="Portrait of Allen Shibu" initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }} />
    </motion.figure>
  )
}

function Header({ active, theme, onToggleTheme }: { active: string; theme: Theme; onToggleTheme: () => void }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header site-header--docked fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"><div className="site-header-shell glass mx-auto flex h-14 max-w-[1440px] items-center justify-between rounded-2xl px-3 pl-4 sm:px-5"><nav className="primary-nav hidden items-center gap-1 md:flex" aria-label="Primary navigation"><a href="#top" className="nav-link dock-home" aria-current={active === 'top' ? 'location' : undefined} aria-label="Home" data-tooltip="Home"><DockGlyph id="top" /><span className="nav-label">Home</span></a>{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className="nav-link" aria-current={active === id ? 'location' : undefined} aria-label={label} data-tooltip={label}><DockGlyph id={id} /><span className="nav-label">{label}</span></a>)}</nav><div className="header-actions"><button type="button" className="theme-toggle pressable" aria-label={`Switch to ${nextTheme} mode`} data-tooltip={`${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`} onClick={onToggleTheme}><span aria-hidden="true">◐</span></button><HeaderContactLinks darkSurface={theme === 'light'} /></div></div></header></>
}

function Hero({ theme }: { theme: Theme }) {
  return <section id="top" data-scroll-section className="hero-scroll"><div className="hero-sticky"><KineticGrid className="hero-grid" globalColor="monochrome" colorScheme={theme}><HeroPortrait /><div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:items-center lg:px-16"><div className="max-w-[1050px]"><h1 className="hero-title hero-enter">Hi, I&apos;m<br /> <span>Allen Shibu</span></h1><p className="hero-position hero-enter">Product builder · <span className="whitespace-nowrap">Co-founder, Astrelon Labs</span> · AWS Student Builders Group Leader.</p></div></div></KineticGrid></div></section>
}

function RightNow() {
  return <section id="now" className="now-scroll"><div className="now-sticky"><div className="now-heading"><h2>So, What&apos;s <em>Cooking?</em></h2></div><ol className="role-list">{roles.map(([title, copy], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></section>
}

function TechStack() {
  return <section id="skills" data-observe className="tech-stack-section"><div className="tech-stack-inner reveal-in"><h2 className="tech-stack-title">Tech stack &amp; ecosystem</h2><ul aria-label="Technologies I use">{techStack.map(([name, icon]) => <li key={name}>{icon}<span>{name}</span></li>)}</ul><small>Icons by <a href="https://thesvg.org/" target="_blank" rel="noreferrer">theSVG</a></small></div></section>
}

function Projects() {
  const [selected, setSelected] = useState(0)
  const project = projects[selected]
  return <section id="projects" className="project-section"><div className="project-showcase"><header className="project-heading"><h2>Products I shipped</h2><p>Real products, constrained users, working backends.</p></header><div className="project-tabs" role="group" aria-label="Select a project">{projects.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.name}</button>)}</div><article className="project-panel" aria-live="polite"><div className="project-visual"><img src={project.image} alt={`${project.name} product interface`} decoding="async" /></div><div className="project-details"><p className="project-eyebrow">Project 0{selected + 1}</p><h3>{project.name}</h3><p className="project-copy">{project.copy}</p><ul className="project-stack" aria-label={`${project.name} technology stack`}>{project.stack.split(' · ').map((item) => <li key={item}>{item}</li>)}</ul><a className="project-action pressable" href={project.href} target="_blank" rel="noreferrer">{project.action}<Arrow diagonal /></a></div></article></div></section>
}

function Hackathons() {
  return (
    <section id="hackathons" data-observe className="hackathons-section">
      <div className="hackathons-inner">
        <header className="hackathons-header reveal-in">
          <h2>I like building things</h2>
          <p>Hackathons I have participated in so far—short, focused sprints where ideas have to become something real.</p>
        </header>
        <ol className="hackathon-list">
          {hackathons.map(([mark, name, date, copy, image, href]) => (
            <li key={name} className="reveal-in">
              <span className="hackathon-mark" aria-hidden="true">{mark === 'META' ? <Meta className="h-5 w-7" /> : image ? <img src={image} alt="" /> : mark}</span>
              <div><small>{date}</small><h3>{href ? <a href={href} target="_blank" rel="noreferrer">{name}<Arrow diagonal /></a> : name}</h3><p>{copy}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Credibility() {
  return <section id="proof" data-observe className="credibility-section"><div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-16 lg:py-40"><div className="credibility-intro reveal-in"><h2 className="section-display">Momentum with<br /><em>receipts.</em></h2></div><ol className="credibility-list">{credibility.map(([title, copy, href], index) => <li key={title} className="reveal-in"><span>0{index + 1}</span><h3>{href ? <a href={href} target="_blank" rel="noreferrer">{title}<Arrow diagonal /></a> : title}</h3><p>{copy}</p></li>)}</ol></div></section>
}

function GithubActivity() {
  return <section className="github-activity"><div className="github-activity-inner"><div className="github-activity-copy"><h2 className="section-display">A record of<br /><em>building.</em></h2><p>Recent building activity, translated into a small playable surface.</p></div><div className="github-calendar-build"><GithubCalendar username="Allen-Shibu" cellSize={16} cellGap={4} className="github-calendar-feature" /></div></div></section>
}

function Journal() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState(0)
  const [src, alt] = journalItems[selected]
  const move = (direction: number) => setSelected((current) => (current + direction + journalItems.length) % journalItems.length)

  return <>
    <section id="gallery" data-scroll-section className="journal-scroll">
      <div className="journal-sticky">
        <header className="journal-heading"><h2>Where I&apos;ve Been</h2><p>The People, The Rooms</p></header>
        <div className="journal-grid">{journalItems.slice(0, 5).map(([image, description], index) => <figure key={image} className={`journal-card journal-card--${index + 1}`}><img src={image} alt={description} loading="lazy" decoding="async" />{index === 4 && <button type="button" className="journal-view-toggle pressable" onClick={() => { setSelected(0); dialog.current?.showModal() }}>View Gallery</button>}</figure>)}</div>
      </div>
    </section>
    <dialog ref={dialog} className="gallery-dialog" aria-labelledby="gallery-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1) }}>
      <div className="gallery-dialog-shell">
        <header><h2 id="gallery-dialog-title">Gallery</h2><button type="button" className="pressable" onClick={() => dialog.current?.close()}>Close</button></header>
        <figure><img src={src} alt={alt} /></figure>
        <nav aria-label="Gallery controls"><button type="button" className="pressable" onClick={() => move(-1)}>Previous</button><button type="button" className="pressable" onClick={() => move(1)}>Next</button></nav>
      </div>
    </dialog>
  </>
}

function Contact() {
  return <section id="contact" data-scroll-section data-observe className="contact-scroll"><div className="contact-sticky"><div className="closing-kinetic" aria-hidden="true"><span>THINK</span><span>BUILD</span><span>SHIP</span></div><div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 lg:px-16"><div className="my-auto max-w-5xl"><h2>To infinity<br /><span>and beyond!</span></h2></div><footer className="site-footer"><div><span>Allen Shibu · Kerala, India</span><span>Co-founder, Astrelon Labs · 2026</span></div><nav className="footer-connect" aria-label="Connect with me"><span>Connect with me</span><ContactLinks compact /></nav></footer></div></div></section>
}

export default function App() {
  const [active, setActive] = useState('top')
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  useScrollCraft()
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080a09' : '#ffffff')
    try { localStorage.setItem('theme', theme) } catch { /* Storage can be unavailable in privacy modes. */ }
  }, [theme])
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('#top, #now, #skills, #projects')]
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
  return <><Header active={active} theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} /><main id="main"><Hero theme={theme} /><RightNow /><TechStack /><Projects /><Hackathons /><Credibility /><GithubActivity /><Journal /><Contact /></main></>
}
