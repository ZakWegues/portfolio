'use client'

import { motion, useInView, animate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { GithubData } from '@/lib/github'
import { education, languages, person, skills } from '@/lib/data'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#663399',
  Java: '#b07219',
  EJS: '#a91e50',
  Python: '#3572A5',
}

function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const c = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v).toLocaleString('pt-BR') + suffix),
    })
    return () => c.stop()
  }, [inView, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 3600) return `há ${Math.max(1, Math.round(s / 60))} min`
  if (s < 86400) return `há ${Math.round(s / 3600)} h`
  return `há ${Math.round(s / 86400)} d`
}

export function GithubLive({ data }: { data: GithubData }) {
  return (
    <section id="github" className="relative px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          ( github {data.live ? 'ao vivo' : ''} )
          {data.live && <span className="ml-3 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 align-middle" />}
        </p>
        <h2 className="max-w-5xl text-5xl font-bold leading-[0.9] tracking-[-0.04em] md:text-8xl">
          Eu não paro de <span className="font-serif font-normal italic text-gradient">commitar.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-12">
        <Reveal className="glass rounded-3xl p-7 md:col-span-4" delay={0.05}>
          <div className="font-mono text-xs uppercase tracking-wider text-white/50">commits nos 5 projetos</div>
          <div className="mt-3 text-6xl font-bold tracking-tight md:text-7xl">
            <Count to={data.commits} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
            <div>
              <div className="text-3xl font-semibold">
                <Count to={data.repos} />
              </div>
              <div className="font-mono text-[11px] uppercase text-white/45">repositórios</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">
                <Count to={data.stars} />
              </div>
              <div className="font-mono text-[11px] uppercase text-white/45">estrelas</div>
            </div>
          </div>
        </Reveal>

        <Reveal className="glass rounded-3xl p-7 md:col-span-8" delay={0.12}>
          <div className="font-mono text-xs uppercase tracking-wider text-white/50">linguagens</div>
          <div className="mt-5 flex h-4 overflow-hidden rounded-full">
            {data.languages.map((l) => (
              <motion.div
                key={l.name}
                initial={{ width: 0 }}
                whileInView={{ width: `${l.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: LANG_COLORS[l.name] ?? '#888' }}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {data.languages.map((l) => (
              <div key={l.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[l.name] ?? '#888' }} />
                {l.name} <span className="text-white/45">{l.pct}%</span>
              </div>
            ))}
          </div>

          <div className="mt-8 font-mono text-xs uppercase tracking-wider text-white/50">atividade recente</div>
          <ul className="mt-3 divide-y divide-white/[0.07]">
            {(data.recent.length ? data.recent : [{ repo: 'elysium', message: 'veja todos os commits no GitHub', date: '' }]).slice(0, 5).map((r, i) => (
              <li key={i} className="flex items-center gap-4 py-3 text-sm">
                <span className="w-28 shrink-0 truncate font-mono text-[var(--accent-2)]">{r.repo}</span>
                <span className="flex-1 truncate text-white/75">{r.message}</span>
                {r.date && <span className="shrink-0 font-mono text-xs text-white/40">{ago(r.date)}</span>}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-8" delay={0.1}>
        <a href={person.github} target="_blank" rel="noopener noreferrer" data-cursor="github" className="group inline-flex items-center gap-3 font-mono text-sm text-white/70 hover:text-white">
          github.com/{person.handle}
          <span className="transition group-hover:translate-x-1">→</span>
        </a>
      </Reveal>
    </section>
  )
}

export function About() {
  return (
    <section id="sobre" className="relative px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">( sobre )</p>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Comecei com exercícios de aula. Hoje faço <span className="font-serif font-normal italic text-gradient">software que eu mesmo uso</span> todo dia.
          </h2>
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-white/65">
            {person.bio.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
        </Reveal>

        <div className="space-y-4 md:col-span-5">
          <Reveal className="glass rounded-3xl p-7" delay={0.1}>
            <div className="font-mono text-xs uppercase tracking-wider text-white/50">formação</div>
            <div className="mt-3 text-2xl font-semibold">{education.institution}</div>
            <div className="text-white/70">{education.course}</div>
            <div className="mt-1 text-sm text-white/45">
              {education.note} · {education.period}
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.round((education.year / education.totalYears) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-2 font-mono text-[11px] text-white/40">{education.year}º de {education.totalYears} anos</div>
          </Reveal>

          <Reveal className="glass rounded-3xl p-7" delay={0.18}>
            <div className="font-mono text-xs uppercase tracking-wider text-white/50">o que eu domino</div>
            <div className="mt-4 space-y-4">
              {skills.map((s) => (
                <div key={s.group} className="flex gap-4">
                  <div className="w-20 shrink-0 font-mono text-xs uppercase text-[var(--accent)]">{s.group}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <span key={i} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-white/80">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="glass flex justify-between rounded-3xl p-7" delay={0.24}>
            {languages.map((l) => (
              <div key={l.name}>
                <div className="text-xl font-semibold">{l.name}</div>
                <div className="font-mono text-xs text-white/45">{l.level}</div>
              </div>
            ))}
            <div>
              <div className="text-xl font-semibold">{person.age}</div>
              <div className="font-mono text-xs text-white/45">anos</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${person.email}`
    }
  }
  return (
    <section id="contato" className="relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-40">
      <Reveal>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-white/50">( contato )</p>
        <h2 className="text-[17vw] font-bold leading-[0.82] tracking-[-0.06em] md:text-[12vw]">
          Bora
          <br />
          <span className="font-serif font-normal italic text-gradient">construir</span>
          <br />
          algo?
        </h2>
      </Reveal>

      <Reveal className="mt-14 grid gap-4 md:grid-cols-3" delay={0.1}>
        <button onClick={copy} data-cursor={copied ? 'copiado' : 'copiar'} className="glass group rounded-3xl p-7 text-left transition hover:border-[var(--accent)]">
          <div className="font-mono text-xs uppercase tracking-wider text-white/50">{copied ? 'copiado ✓' : 'e-mail · clique pra copiar'}</div>
          <div className="mt-3 break-all text-xl font-semibold md:text-2xl">{person.email}</div>
        </button>
        <a href={person.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="zap" className="glass rounded-3xl p-7 transition hover:border-[#25D366]">
          <div className="font-mono text-xs uppercase tracking-wider text-white/50">whatsapp</div>
          <div className="mt-3 text-xl font-semibold md:text-2xl">{person.phone}</div>
        </a>
        <a href={person.github} target="_blank" rel="noopener noreferrer" data-cursor="github" className="glass rounded-3xl p-7 transition hover:border-white/50">
          <div className="font-mono text-xs uppercase tracking-wider text-white/50">github</div>
          <div className="mt-3 text-xl font-semibold md:text-2xl">@{person.handle}</div>
        </a>
      </Reveal>

      <footer className="mt-28 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 font-mono text-xs text-white/40 md:flex-row">
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span>
          feito com Next.js, three.js e muito café · aperte <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-white/70">&apos;</kbd> pra abrir o terminal em qualquer lugar
        </span>
      </footer>
    </section>
  )
}
