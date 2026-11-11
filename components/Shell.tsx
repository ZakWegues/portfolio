'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'motion/react'
import Terminal from './Terminal'

const Orb = dynamic(() => import('./Orb'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(m.matches)
    const f = () => setR(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return r
}

let lenisRef: Lenis | null = null
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef) lenisRef.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setOn(true)
    document.body.classList.add('has-cursor')
    const pos = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2 }
    let raf = 0
    const move = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
      setLabel(t?.dataset.cursor ?? (t ? '•' : ''))
    }
    const loop = () => {
      pos.rx += (pos.x - pos.rx) * 0.16
      pos.ry += (pos.y - pos.ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`
      if (ring.current) ring.current.style.transform = `translate3d(${pos.rx}px,${pos.ry}px,0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move)
    loop()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  if (!on) return null
  const big = label && label !== '•'
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[80] -ml-1 -mt-1 h-2 w-2 rounded-full bg-white mix-blend-difference" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[80]">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 font-mono text-[11px] uppercase tracking-widest text-black transition-all duration-300 ease-out"
          style={{
            width: big ? 92 : label ? 54 : 34,
            height: big ? 92 : label ? 54 : 34,
            background: big ? 'var(--accent)' : 'transparent',
            borderColor: big ? 'transparent' : undefined,
          }}
        >
          {big ? label : ''}
        </div>
      </div>
    </>
  )
}

function Intro({ done }: { done: () => void }) {
  const lines = ['> boot isaac.os v16', '> carregando projetos ......... ok', '> conectando ao github ........ ok', '> pronto.']
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n < lines.length) {
      const t = setTimeout(() => setN(n + 1), n === 0 ? 120 : 260)
      return () => clearTimeout(t)
    }
    const t = setTimeout(done, 380)
    return () => clearTimeout(t)
  }, [n]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end bg-[var(--bg)] p-6 md:p-12"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }}
      onClick={done}
    >
      <div className="font-mono text-sm text-white/70 md:text-base">
        {lines.slice(0, n).map((l) => (
          <div key={l}>{l}</div>
        ))}
        <span className="inline-block h-4 w-2 animate-pulse bg-[var(--accent)] align-middle" />
      </div>
      <div className="absolute right-6 top-6 font-mono text-xs text-white/40 md:right-12 md:top-12">{Math.min(100, Math.round((n / lines.length) * 100))}%</div>
    </motion.div>
  )
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  const [intro, setIntro] = useState(true)

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef = null
    }
  }, [reduced])

  useEffect(() => {
    document.documentElement.style.overflow = intro ? 'hidden' : ''
    if (!intro) ScrollTrigger.refresh()
  }, [intro])

  return (
    <>
      <Orb calm={reduced} />
      <Cursor />
      <Terminal />
      <AnimatePresence>{intro && <Intro done={() => setIntro(false)} />}</AnimatePresence>
      <div className="relative z-10">{children}</div>
    </>
  )
}
