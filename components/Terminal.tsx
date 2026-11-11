'use client'

import { AnimatePresence, motion, useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { person, projects, stackMarquee } from '@/lib/data'
import { DEFAULT_ACCENT, setAccent } from '@/lib/accent'

type Part = { t: string; c?: string }
type Line = { kind: 'in' | 'out' | 'accent' | 'rich'; text?: string; parts?: Part[]; logo?: 'tight' | 'small' }

const THEMES: Record<string, [string, string]> = {
  roxo: [DEFAULT_ACCENT.a, DEFAULT_ACCENT.b],
  ambar: ['#F59E0B', '#E11D48'],
  ciano: ['#22D3EE', '#3B82F6'],
  verde: ['#10B981', '#A3E635'],
  rosa: ['#EC4899', '#F97316'],
}

const SLUGS: Record<string, string> = {
  elysium: 'elysium',
  'elysium-m': 'elysium',
  scrollyourbrain: 'scrollyourbrain',
  syb: 'scrollyourbrain',
  'manual-etec': 'manual-etec',
  manual: 'manual-etec',
  cashup: 'cashup',
}

const COMMANDS = ['help', 'whoami', 'neofetch', 'ls', 'projects', 'cat', 'open', 'stack', 'theme', 'contact', 'github', 'date', 'echo', 'sudo', 'clear', 'exit']

const LOGO = [
  ' ___  ____      _        _      ____ ',
  '|_ _|/ ___|    / \\      / \\    / ___|',
  ' | | \\___ \\   / _ \\    / _ \\  | |    ',
  ' | |  ___) | / ___ \\  / ___ \\ | |___ ',
  '|___||____/ /_/   \\_\\/_/   \\_\\ \\____|',
]

const out = (t: string): Line => ({ kind: 'out', text: t })
const acc = (t: string): Line => ({ kind: 'accent', text: t })

function run(cmd: string, ctx: { commits: number; embedded: boolean; narrow: boolean }): Line[] | 'clear' | 'exit' {
  const [raw, ...args] = cmd.trim().split(/\s+/)
  const c = (raw || '').toLowerCase()
  switch (c) {
    case '':
      return []
    case 'help':
    case 'ajuda':
      return [
        acc('comandos:'),
        out('  whoami          quem é o Isaac'),
        out('  neofetch        ficha técnica com estilo'),
        out('  ls | projects   lista os projetos'),
        out('  cat <projeto>   detalhes (ex: cat elysium)'),
        out('  open <projeto>  abre o código no GitHub'),
        out('  theme <cor>     muda a cor do site: ' + Object.keys(THEMES).join(', ')),
        out('  stack · contact · github · date · clear'),
        out('  sudo hire-me    ;)'),
        out('dica: Tab completa, ↑ repete o último comando'),
      ]
    case 'whoami':
      return [acc(`${person.name}`), out(`${person.age} anos · ${person.location}`), out(person.bio[0])]
    case 'neofetch': {
      const info: Part[][] = [
        [{ t: 'isaac', c: 'var(--accent)' }, { t: '@' }, { t: 'portfolio', c: 'var(--accent)' }],
        [{ t: '─────────────────' }],
        [{ t: 'OS       ', c: 'var(--accent-2)' }, { t: 'isaac.os v16' }],
        [{ t: 'Host     ', c: 'var(--accent-2)' }, { t: 'ETEC Guaianases · DS' }],
        [{ t: 'Uptime   ', c: 'var(--accent-2)' }, { t: `${person.age} anos` }],
        [{ t: 'Shell    ', c: 'var(--accent-2)' }, { t: 'TypeScript' }],
        [{ t: 'Projetos ', c: 'var(--accent-2)' }, { t: `${projects.length} no GitHub` }],
        [{ t: 'Commits  ', c: 'var(--accent-2)' }, { t: `${ctx.commits}+` }],
        [{ t: 'Idiomas  ', c: 'var(--accent-2)' }, { t: 'PT nativo · EN intermediário' }],
      ]
      const lines: Line[] = []
      if (ctx.narrow) {
        // celular: logo em cima, ficha embaixo
        LOGO.forEach((l) => lines.push({ kind: 'rich', logo: 'small', parts: [{ t: l, c: 'var(--accent)' }] }))
        lines.push(out(''))
        info.forEach((p) => lines.push({ kind: 'rich', parts: p }))
      } else {
        const rows = Math.max(LOGO.length, info.length)
        for (let i = 0; i < rows; i++) {
          const left = (LOGO[i] ?? '').padEnd(LOGO[0].length + 4)
          lines.push({ kind: 'rich', logo: 'tight', parts: [{ t: left, c: 'var(--accent)' }, ...(info[i] ?? [])] })
        }
      }
      lines.push({ kind: 'rich', parts: ['#7C5CFF', '#22D3EE', '#F59E0B', '#E11D48', '#10B981', '#EC4899', '#3B82F6', '#f4f2ff'].map((col) => ({ t: '███', c: col })) })
      return lines
    }
    case 'ls':
      return [{ kind: 'rich', parts: projects.flatMap((p) => [{ t: `${p.slug}/`, c: p.color }, { t: '   ' }]) }]
    case 'projects':
      return projects.map((p, i) => ({ kind: 'rich', parts: [{ t: `  [${i + 1}] ` }, { t: p.name.padEnd(16), c: p.color }, { t: p.kind }] }))
    case 'cat': {
      const key = SLUGS[(args[0] ?? '').toLowerCase().replace(/\/$/, '')] ?? projects[Number(args[0]) - 1]?.slug
      const p = projects.find((x) => x.slug === key)
      if (!p) return [out('uso: cat <projeto>  ·  projetos: ' + projects.map((x) => x.slug).join(', '))]
      return [
        { kind: 'rich', parts: [{ t: p.name, c: p.color }, { t: `  —  ${p.kind}` }] },
        out(p.tagline),
        out(''),
        out(p.description),
        out(''),
        ...p.highlights.map((h) => out('  • ' + h)),
        out(''),
        { kind: 'rich', parts: [{ t: 'stack  ', c: 'var(--accent-2)' }, { t: p.stack.join(' · ') }] },
        { kind: 'rich', parts: [{ t: 'código ', c: 'var(--accent-2)' }, { t: p.links.find((l) => l.label.startsWith('Código'))?.href ?? p.links[0].href }] },
      ]
    }
    case 'open': {
      const key = SLUGS[(args[0] ?? '').toLowerCase()] ?? projects[Number(args[0]) - 1]?.slug
      const p = projects.find((x) => x.slug === key)
      if (!p) return [out('uso: open <projeto ou número>')]
      const link = p.links.find((l) => l.label.startsWith('Código')) ?? p.links[0]
      window.open(link.href, '_blank', 'noopener')
      return [out(`abrindo ${p.name}…`)]
    }
    case 'theme': {
      const name = (args[0] ?? '').toLowerCase()
      const pick = name === 'random' ? Object.keys(THEMES)[Math.floor(Math.random() * Object.keys(THEMES).length)] : name
      const t = THEMES[pick]
      if (!t) return [out('uso: theme <' + Object.keys(THEMES).join(' | ') + ' | random>')]
      setAccent(t[0], t[1])
      return [{ kind: 'rich', parts: [{ t: '● ', c: t[0] }, { t: `tema "${pick}" aplicado — olha o orb ;)` }] }]
    }
    case 'stack':
      return [out(stackMarquee.join(' · '))]
    case 'contact':
      return [
        { kind: 'rich', parts: [{ t: 'email     ', c: 'var(--accent-2)' }, { t: person.email }] },
        { kind: 'rich', parts: [{ t: 'whatsapp  ', c: 'var(--accent-2)' }, { t: person.phone }] },
        { kind: 'rich', parts: [{ t: 'github    ', c: 'var(--accent-2)' }, { t: person.github }] },
      ]
    case 'github':
      window.open(person.github, '_blank', 'noopener')
      return [out('abrindo github.com/ZakWegues…')]
    case 'date':
      return [out(new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' }))]
    case 'echo':
      return [out(args.join(' '))]
    case 'sudo':
      if (args.join(' ').toLowerCase() === 'hire-me')
        return [acc('[sudo] permissão concedida.'), out('excelente decisão. me chama:'), out(`  ${person.email}`)]
      return [out('sudo: só aceito "sudo hire-me"')]
    case 'rm':
      return [out('boa tentativa.')]
    case 'clear':
      return 'clear'
    case 'exit':
      return ctx.embedded ? [out('esse terminal mora aqui. tenta "clear" ;)')] : 'exit'
    default:
      return [out(`comando não encontrado: ${raw}. digite "help"`)]
  }
}

function complete(v: string) {
  const parts = v.split(' ')
  if (parts.length === 1) {
    const m = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()))
    return m.length === 1 ? m[0] + ' ' : v
  }
  const pool = parts[0] === 'theme' ? [...Object.keys(THEMES), 'random'] : parts[0] === 'cat' || parts[0] === 'open' ? projects.map((p) => p.slug) : []
  const m = pool.filter((x) => x.startsWith(parts[1].toLowerCase()))
  return m.length === 1 ? `${parts[0]} ${m[0]}` : v
}

const WELCOME: Line[] = [acc('isaac.os — último login: agora, no seu navegador'), out('digite "help" ou clique num comando abaixo.')]

type WindowProps = {
  embedded?: boolean
  autoplay?: string[]
  commits: number
  onClose?: () => void
  className?: string
}

export function TerminalWindow({ embedded = false, autoplay, commits, onClose, className = '' }: WindowProps) {
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [value, setValue] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { once: true, amount: 0.5 })
  const cancel = useRef(false)

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const exec = useCallback(
    (cmd: string) => {
      const r = run(cmd, { commits, embedded, narrow: window.innerWidth < 640 })
      if (cmd.trim()) setHist((h) => [cmd, ...h])
      setHi(-1)
      if (r === 'clear') return setLines([])
      if (r === 'exit') return onClose?.()
      setLines((l) => [...l, { kind: 'in', text: cmd }, ...r])
    },
    [commits, embedded, onClose],
  )

  // "Digita" um comando letra a letra antes de executar.
  const typeAndRun = useCallback(
    async (cmd: string, speed = 55) => {
      setBusy(true)
      for (let i = 1; i <= cmd.length; i++) {
        if (cancel.current) break
        setValue(cmd.slice(0, i))
        await new Promise((r) => setTimeout(r, speed + Math.random() * 40))
      }
      if (!cancel.current) {
        await new Promise((r) => setTimeout(r, 250))
        setValue('')
        exec(cmd)
      }
      setBusy(false)
    },
    [exec],
  )

  useEffect(() => {
    if (!autoplay || !inView) return
    cancel.current = false
    ;(async () => {
      await new Promise((r) => setTimeout(r, 500))
      for (const c of autoplay) {
        if (cancel.current) return
        await typeAndRun(c)
        await new Promise((r) => setTimeout(r, 900))
      }
    })()
    return () => {
      cancel.current = true
    }
  }, [autoplay, inView, typeAndRun])

  useEffect(() => {
    if (!embedded) setTimeout(() => input.current?.focus(), 50)
  }, [embedded])

  const takeOver = () => {
    if (busy) {
      cancel.current = true
      setValue('')
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    exec(value)
    setValue('')
  }

  const chips = ['help', 'whoami', 'neofetch', 'cat elysium', 'projects', 'theme random', 'sudo hire-me']

  return (
    <div ref={root} className={className}>
      <div
        className="overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b12]/90 shadow-[0_50px_140px_-40px_var(--accent)] backdrop-blur-xl"
        onClick={() => {
          takeOver()
          input.current?.focus({ preventScroll: true })
        }}
      >
        <div className="relative flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <button
            aria-label={embedded ? 'Limpar terminal' : 'Fechar terminal'}
            onClick={(e) => {
              e.stopPropagation()
              if (embedded) setLines([])
              else onClose?.()
            }}
            className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] text-[8px] leading-none text-black/60"
          >
            <span className="hidden group-hover:inline">×</span>
          </button>
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="pointer-events-none absolute inset-x-0 hidden text-center font-mono text-xs text-white/45 sm:block">isaac@portfolio — zsh — 80×24</span>
        </div>
        <div
          ref={body}
          data-lenis-prevent
          className={`noscroll overflow-y-auto p-4 font-mono text-[12px] leading-relaxed md:p-5 md:text-[13.5px] ${embedded ? 'h-[420px] md:h-[460px]' : 'h-[52vh] md:h-[400px]'}`}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={`${l.kind === 'in' ? 'mt-2 text-white' : l.kind === 'accent' ? 'text-[var(--accent)]' : 'whitespace-pre-wrap break-words text-white/65'} ${l.logo === 'small' ? 'text-[10px] leading-[1.2]' : l.logo === 'tight' ? 'leading-[1.25]' : ''}`}
            >
              {l.kind === 'in' && (
                <>
                  <span className="text-[var(--accent-2)]">isaac@portfolio</span>
                  <span className="text-white/40"> ~ </span>
                  <span className="text-[var(--accent)]">❯ </span>
                </>
              )}
              {l.kind === 'rich'
                ? l.parts!.map((p, k) => (
                    <span key={k} style={p.c ? { color: p.c } : undefined} className="whitespace-pre">
                      {p.t}
                    </span>
                  ))
                : l.text}
            </div>
          ))}
          <form onSubmit={submit} className="mt-2 flex items-center">
            <span className="whitespace-nowrap">
              <span className="text-[var(--accent-2)]">isaac@portfolio</span>
              <span className="text-white/40"> ~ </span>
              <span className="text-[var(--accent)]">❯&nbsp;</span>
            </span>
            <input
              ref={input}
              value={value}
              onChange={(e) => {
                takeOver()
                setValue(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  setValue(complete(value))
                }
                if (e.key === 'ArrowUp' && hist.length) {
                  e.preventDefault()
                  const n = Math.min(hi + 1, hist.length - 1)
                  setHi(n)
                  setValue(hist[n])
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const n = hi - 1
                  setHi(n)
                  setValue(n >= 0 ? hist[n] : '')
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-white caret-[var(--accent)] outline-none"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Comando do terminal"
              enterKeyHint="send"
            />
          </form>
        </div>
        <div className="noscroll flex gap-2 overflow-x-auto border-t border-white/10 bg-white/[0.02] px-4 py-3">
          {chips.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation()
                if (busy) return
                typeAndRun(c, 35)
              }}
              data-cursor="rodar"
              className="shrink-0 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] text-white/75 transition hover:border-[var(--accent)] hover:text-white md:text-xs"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TerminalSection({ commits }: { commits: number }) {
  return (
    <section id="terminal" className="relative px-5 py-24 md:px-10 md:py-32">
      <motion.div
        className="mx-auto max-w-4xl"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/50">( isaac.os )</p>
          <h2 className="text-4xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
            Prefere conhecer pelo <span className="font-serif font-normal italic text-gradient">terminal?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/55">Ele funciona de verdade. Digita um comando ou clica num botão embaixo.</p>
        </div>
        <TerminalWindow embedded commits={commits} autoplay={['whoami', 'neofetch']} />
      </motion.div>
    </section>
  )
}

export default function TerminalOverlay({ commits }: { commits: number }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if ((e.key === '`' || e.key === '~' || e.key === "'") && !typing) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const ev = () => setOpen(true)
    window.addEventListener('keydown', key)
    window.addEventListener('open-terminal', ev)
    return () => {
      window.removeEventListener('keydown', key)
      window.removeEventListener('open-terminal', ev)
    }
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          data-lenis-prevent
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ y: 40, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <TerminalWindow commits={commits} onClose={() => setOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
