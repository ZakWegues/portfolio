'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { person, projects, stackMarquee } from '@/lib/data'

type Line = { kind: 'in' | 'out' | 'accent'; text: string }

const HELP = [
  'comandos disponíveis:',
  '  whoami        quem é o Isaac',
  '  projects      lista os projetos',
  '  open <n>      abre o projeto n no GitHub',
  '  stack         tecnologias que eu uso',
  '  contact       como falar comigo',
  '  github        abre meu GitHub',
  '  sudo hire-me  ;)',
  '  clear | exit',
]

function run(cmd: string): Line[] | 'clear' | 'exit' {
  const [c, ...args] = cmd.trim().split(/\s+/)
  const out = (t: string): Line => ({ kind: 'out', text: t })
  switch ((c || '').toLowerCase()) {
    case '':
      return []
    case 'help':
    case 'ajuda':
      return HELP.map(out)
    case 'whoami':
      return [out(`${person.name} — ${person.age} anos, ${person.location}`), out(person.bio[0])]
    case 'projects':
    case 'ls':
      return projects.map((p, i) => out(`  [${i + 1}] ${p.name.padEnd(16)} ${p.kind}`))
    case 'open': {
      const p = projects[Number(args[0]) - 1]
      if (!p) return [out('uso: open <1-4>')]
      const link = p.links.find((l) => l.href.includes('github.com') && !l.href.includes('releases')) ?? p.links[0]
      window.open(link.href, '_blank', 'noopener')
      return [out(`abrindo ${p.name}…`)]
    }
    case 'stack':
      return [out(stackMarquee.join(' · '))]
    case 'contact':
      return [out(`email     ${person.email}`), out(`whatsapp  ${person.phone}`), out(`github    ${person.github}`)]
    case 'github':
      window.open(person.github, '_blank', 'noopener')
      return [out('abrindo github.com/ZakWegues…')]
    case 'sudo':
      if (args.join(' ') === 'hire-me')
        return [
          { kind: 'accent', text: '[sudo] permissão concedida.' },
          out('excelente decisão. me chama:'),
          out(`  ${person.email}`),
        ]
      return [out('sudo: só aceito "sudo hire-me"')]
    case 'rm':
      return [out('boa tentativa.')]
    case 'clear':
      return 'clear'
    case 'exit':
      return 'exit'
    default:
      return [out(`comando não encontrado: ${c}. digite "help"`)]
  }
}

export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([
    { kind: 'accent', text: 'isaac.os — terminal secreto. você achou :)' },
    { kind: 'out', text: 'digite "help" para começar.' },
  ])
  const [value, setValue] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA'
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

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight })
  }, [lines])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const r = run(value)
    const echo: Line = { kind: 'in', text: value }
    if (value.trim()) setHist((h) => [value, ...h])
    setHi(-1)
    setValue('')
    if (r === 'clear') return setLines([])
    if (r === 'exit') return setOpen(false)
    setLines((l) => [...l, echo, ...r])
  }

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
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/95 shadow-2xl shadow-black"
            initial={{ y: 40, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => {
              e.stopPropagation()
              input.current?.focus()
            }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <button aria-label="Fechar terminal" onClick={() => setOpen(false)} className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-white/40">isaac@portfolio: ~</span>
            </div>
            <div ref={body} className="noscroll h-[52vh] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed md:h-[380px]">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={l.kind === 'in' ? 'text-white' : l.kind === 'accent' ? 'text-[var(--accent)]' : 'whitespace-pre-wrap text-white/60'}
                >
                  {l.kind === 'in' && <span className="text-[var(--accent-2)]">❯ </span>}
                  {l.text}
                </div>
              ))}
              <form onSubmit={submit} className="flex items-center">
                <span className="text-[var(--accent-2)]">❯&nbsp;</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' && hist.length) {
                      const n = Math.min(hi + 1, hist.length - 1)
                      setHi(n)
                      setValue(hist[n])
                    }
                    if (e.key === 'ArrowDown') {
                      const n = hi - 1
                      setHi(n)
                      setValue(n >= 0 ? hist[n] : '')
                    }
                  }}
                  className="flex-1 bg-transparent text-white caret-[var(--accent)] outline-none"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Comando"
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
