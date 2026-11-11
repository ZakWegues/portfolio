'use client'

import { motion, type Variants } from 'motion/react'
import { useEffect, useState } from 'react'
import { person } from '@/lib/data'
import { scrollToId } from './Shell'

const WORDS = ['assistentes de voz', 'apps Android', 'produtos reais', 'plataformas web', 'coisas que funcionam']

function Rotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-flex h-[1.15em] overflow-hidden align-bottom">
      <motion.span
        key={i}
        className="text-gradient whitespace-nowrap font-serif italic"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {WORDS[i]}
      </motion.span>
    </span>
  )
}

const letter: Variants = {
  hidden: { y: '110%' },
  show: (i: number) => ({ y: '0%', transition: { delay: 1.55 + i * 0.06, duration: 1, ease: [0.22, 1, 0.36, 1] as const } }),
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-[var(--bg)] to-transparent px-5 py-4 md:bg-none md:px-10 md:py-6">
      <button onClick={() => scrollToId('top')} className="font-mono text-sm tracking-tight" data-cursor="topo">
        isaac<span className="text-[var(--accent)]">.</span>dev
      </button>
      <nav className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 text-sm md:flex">
        {[
          ['projetos', 'Projetos'],
          ['github', 'GitHub ao vivo'],
          ['sobre', 'Sobre'],
          ['contato', 'Contato'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => scrollToId(id)} className="rounded-full px-4 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white">
            {label}
          </button>
        ))}
      </nav>
      <button
        onClick={() => window.dispatchEvent(new Event('open-terminal'))}
        className="glass rounded-full px-4 py-2 font-mono text-xs text-white/80 transition hover:text-white"
        data-cursor="hack"
        title="Abrir terminal (tecla ')"
      >
        &gt;_ terminal
      </button>
    </header>
  )
}

export default function Hero({ commits }: { commits: number }) {
  const name = 'ISAAC'
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-28 md:px-10 md:pb-14">
      <motion.div
        className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        disponível para projetos · {person.location.split(' — ')[1] ?? 'SP'}
      </motion.div>

      <h1 className="sr-only">{person.name} — desenvolvedor</h1>
      <div aria-hidden className="flex select-none overflow-hidden leading-[0.8]">
        {name.split('').map((c, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letter}
            initial="hidden"
            animate="show"
            className="inline-block text-[27vw] font-bold tracking-[-0.06em] md:text-[22vw]"
            style={i % 2 ? { WebkitTextStroke: '2px var(--fg)', color: 'transparent' } : undefined}
          >
            {c}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="mt-6 grid gap-8 md:mt-10 md:grid-cols-[1.4fr_1fr] md:items-end"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="max-w-2xl text-2xl leading-tight md:text-4xl">
          Tenho {person.age} anos e construo <br className="hidden md:block" />
          <Rotator />
        </p>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-6 font-mono text-xs text-white/60">
            <div>
              <div className="text-3xl font-sans font-semibold text-white">{commits}+</div>
              commits nos projetos
            </div>
            <div>
              <div className="text-3xl font-sans font-semibold text-white">4</div>
              produtos lançados
            </div>
          </div>
          <button
            onClick={() => scrollToId('projetos')}
            data-cursor="bora"
            className="group flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-[var(--accent)]"
          >
            Ver o que eu construí
            <span className="transition group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      </motion.div>
    </section>
  )
}
