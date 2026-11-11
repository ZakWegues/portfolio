'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Shot } from '@/lib/data'

function useCycle(n: number, ms: number, active: boolean) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active || n < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % n), ms)
    return () => clearInterval(t)
  }, [n, ms, active, i])
  return [i, setI] as const
}

function Dots({ n, i, set }: { n: number; i: number; set: (i: number) => void }) {
  if (n < 2) return null
  return (
    <div className="mt-3 flex justify-center gap-1.5">
      {Array.from({ length: n }).map((_, k) => (
        <button
          key={k}
          aria-label={`Print ${k + 1}`}
          onClick={() => set(k)}
          className="h-1.5 rounded-full transition-all"
          style={{ width: k === i ? 22 : 6, background: k === i ? 'var(--accent)' : 'rgba(255,255,255,.25)' }}
        />
      ))}
    </div>
  )
}

function Slides({ shots, i, alt, fit }: { shots: Shot[]; i: number; alt: string; fit: 'cover' | 'top' }) {
  return (
    <AnimatePresence initial={false}>
      <motion.img
        key={shots[i]?.src}
        src={shots[i]?.src}
        alt={`${alt} — tela ${i + 1}`}
        width={shots[i]?.w}
        height={shots[i]?.h}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`absolute inset-0 h-full w-full ${fit === 'top' ? 'object-cover object-top' : 'object-cover object-top'}`}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </AnimatePresence>
  )
}

export function Laptop({ shots, alt, active = true }: { shots: Shot[]; alt: string; active?: boolean }) {
  const [i, setI] = useCycle(shots.length, 3200, active)
  return (
    <div className="w-full">
      <div className="relative mx-auto w-full" data-cursor="ver">
        <div className="rounded-t-[14px] border border-white/15 bg-[#111] p-[1.6%] shadow-[0_40px_120px_-30px_var(--accent)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black" onClick={() => setI((i + 1) % shots.length)}>
            <Slides shots={shots} i={i} alt={alt} fit="cover" />
          </div>
        </div>
        <div className="relative mx-[-6%] h-3 rounded-b-xl bg-gradient-to-b from-[#2a2a2e] to-[#0e0e10] md:h-4">
          <div className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-[#0a0a0a]" />
        </div>
      </div>
      <Dots n={shots.length} i={i} set={setI} />
    </div>
  )
}

export function Phone({ shots, alt, active = true, className = '', bg = '#000', dots = true }: { shots: Shot[]; alt: string; active?: boolean; className?: string; bg?: string; dots?: boolean }) {
  const [i, setI] = useCycle(shots.length, 2600, active)
  return (
    <div className={className}>
      <div className="relative rounded-[2.6rem] border border-white/15 bg-[#0d0d10] p-[3.5%] shadow-[0_40px_100px_-30px_var(--accent-2)]" data-cursor="ver">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.2rem]" style={{ background: bg }} onClick={() => setI((i + 1) % shots.length)}>
          <Slides shots={shots} i={i} alt={alt} fit="top" />
          <div className="absolute left-1/2 top-2 z-10 h-[3.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
      {dots && <Dots n={shots.length} i={i} set={setI} />}
    </div>
  )
}
