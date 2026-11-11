'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, type Project } from '@/lib/data'
import { DEFAULT_ACCENT, setAccent } from '@/lib/accent'
import { Laptop, Phone } from './Devices'

gsap.registerPlugin(ScrollTrigger)

function Showcase({ p }: { p: Project }) {
  if (p.device === 'phone')
    return (
      <div className="flex items-start justify-center gap-4 md:gap-6">
        <Phone shots={p.shots.slice(0, 4)} alt={p.name} className="w-[44%] max-w-[250px] -rotate-3" />
        <Phone shots={p.shots.slice(4).concat(p.shots.slice(0, 1))} alt={p.name} className="mt-10 w-[40%] max-w-[230px] rotate-3" dots={false} />
      </div>
    )
  return (
    <div className="relative mx-auto w-full max-w-[760px] pb-8 pr-[14%] md:pr-[16%]">
      <Laptop shots={p.shots} alt={p.name} />
      {p.phoneShots && p.phoneShots.length > 0 && (
        <Phone
          shots={p.phoneShots}
          alt={p.device === 'duo' ? 'ELYSIUM-M' : `${p.name} mobile`}
          bg={p.device === 'duo' ? '#0b1220' : '#000'}
          dots={false}
          className="absolute -bottom-2 right-0 w-[29%] min-w-[110px] rotate-[4deg]"
        />
      )}
      {p.device === 'duo' && (
        <svg className="pointer-events-none absolute bottom-[30%] right-[22%] h-24 w-28 overflow-visible" viewBox="0 0 100 80" aria-hidden>
          <path d="M0 10 C 50 0, 60 70, 100 70" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 6">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
          </path>
        </svg>
      )}
    </div>
  )
}

// Em telas baixas o painel encolhe para caber inteiro na altura (só no modo horizontal).
function useFitHeight() {
  const outer = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const measure = () => {
      if (window.innerWidth < 1024) return setScale(1)
      const cs = getComputedStyle(o)
      const avail = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      setScale(Math.min(1, avail / i.offsetHeight))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(i)
    ro.observe(o)
    return () => ro.disconnect()
  }, [])
  return { outer, inner, scale }
}

function Panel({ p, total }: { p: Project; total: number }) {
  const { outer, inner, scale } = useFitHeight()
  return (
    <article
      ref={outer}
      data-project={p.slug}
      data-a={p.color}
      data-b={p.color2}
      className="project-panel relative flex w-full shrink-0 flex-col justify-center px-5 py-20 md:px-10 lg:h-[100svh] lg:w-[100vw] lg:items-center lg:px-16 lg:pb-8 lg:pt-20"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{ background: `radial-gradient(60% 60% at 70% 50%, ${p.color}33, transparent 70%)` }}
      />
      <div
        ref={inner}
        className="flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:gap-14"
        style={scale < 1 ? { transform: `scale(${scale})`, transformOrigin: 'center center' } : undefined}
      >
      <div className="lg:w-[42%]">
        <div className="mb-5 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          <span style={{ color: p.color }}>
            {p.index} / {String(total).padStart(2, '0')}
          </span>
          <span className="h-px flex-1 bg-white/15" />
          <span>{p.year}</span>
        </div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: p.color2 }}>
          {p.kind}
        </p>
        <h3 className="text-5xl font-bold leading-[0.9] tracking-[-0.04em] md:text-7xl lg:text-6xl 2xl:text-8xl">{p.name}</h3>
        <p className="mt-3 font-serif text-2xl italic text-white/90 md:text-3xl lg:text-2xl 2xl:text-3xl">{p.tagline}</p>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65 lg:text-[13.5px] 2xl:text-[15px]">{p.description}</p>

        <ul className="mt-5 space-y-1.5 short:hidden">
          {p.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm text-white/80 lg:text-[13px] 2xl:text-sm">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: p.color }} />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex gap-8">
          {p.stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-semibold md:text-3xl">{s.value}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-white/45">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full border border-white/12 px-3 py-1 font-mono text-[11px] text-white/70">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {p.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="abrir"
              className={
                l.primary
                  ? 'rounded-full px-5 py-2.5 text-sm font-medium text-black transition hover:brightness-110'
                  : 'rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/85 transition hover:border-white/60 hover:text-white'
              }
              style={l.primary ? { background: `linear-gradient(100deg, ${p.color}, ${p.color2})` } : undefined}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="pp-media lg:w-[58%]">
        <Showcase p={p} />
      </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)')
    const f = () => setDesktop(m.matches)
    f()
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])

  useEffect(() => {
    const el = wrap.current
    const tr = track.current
    if (!el || !tr) return
    const panels = gsap.utils.toArray<HTMLElement>('.project-panel', el)

    const ctx = gsap.context(() => {
      if (desktop) {
        const distance = () => tr.scrollWidth - window.innerWidth
        const tween = gsap.to(tr, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            pin: true,
            scrub: 0.8,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (st) => bar.current && (bar.current.style.transform = `scaleX(${st.progress})`),
            onLeave: () => setAccent(DEFAULT_ACCENT.a, DEFAULT_ACCENT.b),
            onLeaveBack: () => setAccent(DEFAULT_ACCENT.a, DEFAULT_ACCENT.b),
          },
        })
        panels.forEach((pn) => {
          ScrollTrigger.create({
            trigger: pn,
            containerAnimation: tween,
            start: 'left 55%',
            end: 'right 55%',
            onToggle: (st) => st.isActive && setAccent(pn.dataset.a!, pn.dataset.b!),
          })
          gsap.from(pn.querySelectorAll('h3, .pp-media'), {
            y: 60,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: pn, containerAnimation: tween, start: 'left 80%', end: 'left 30%', scrub: true },
          })
        })
      } else {
        panels.forEach((pn) => {
          ScrollTrigger.create({
            trigger: pn,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (st) => st.isActive && setAccent(pn.dataset.a!, pn.dataset.b!),
          })
        })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onLeave: () => setAccent(DEFAULT_ACCENT.a, DEFAULT_ACCENT.b),
          onLeaveBack: () => setAccent(DEFAULT_ACCENT.a, DEFAULT_ACCENT.b),
        })
      }
    }, el)
    return () => ctx.revert()
  }, [desktop])

  return (
    <section id="projetos" ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex flex-col lg:h-[100svh] lg:flex-row">
        <div className="flex shrink-0 flex-col justify-center px-5 pb-6 pt-28 md:px-10 lg:h-[100svh] lg:w-[46vw] lg:px-16 lg:py-0">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">( projetos selecionados )</p>
          <h2 className="text-6xl font-bold leading-[0.85] tracking-[-0.05em] md:text-8xl xl:text-[9.5rem]">
            Coisas
            <br />
            que eu
            <br />
            <span className="font-serif font-normal italic text-gradient">tirei</span>
            <br />
            do papel.
          </h2>
          <p className="mt-6 max-w-sm text-white/60">
            Quatro produtos, do primeiro commit ao instalador. Todos com código aberto no GitHub.
            <span className="hidden lg:inline"> Continue rolando →</span>
          </p>
        </div>
        {projects.map((p) => (
          <Panel key={p.slug} p={p} total={projects.length} />
        ))}
      </div>
      <div className="absolute bottom-6 left-1/2 hidden h-[2px] w-48 -translate-x-1/2 overflow-hidden rounded bg-white/10 lg:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-[var(--accent)]" />
      </div>
    </section>
  )
}
