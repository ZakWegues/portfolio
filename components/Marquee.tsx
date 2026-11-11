import { stackMarquee } from '@/lib/data'

function Row({ reverse }: { reverse?: boolean }) {
  const items = [...stackMarquee, ...stackMarquee]
  return (
    <div className="overflow-hidden">
      <div className={`marquee ${reverse ? 'marquee-rev' : ''}`}>
        {items.map((s, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-6 text-4xl font-semibold tracking-tight md:text-7xl">
            <span className={i % 3 === 1 ? 'font-serif font-normal italic text-white/90' : i % 3 === 2 ? 'text-stroke' : ''}>{s}</span>
            <span className="ml-12 inline-block h-3 w-3 rotate-45 bg-[var(--accent)] md:h-4 md:w-4" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section aria-label="Tecnologias" className="relative -rotate-2 border-y border-white/10 bg-[var(--bg)] py-6 md:py-8">
      <Row />
      <div className="h-3 md:h-4" />
      <Row reverse />
    </section>
  )
}
