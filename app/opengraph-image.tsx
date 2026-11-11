import { ImageResponse } from 'next/og'

export const alt = 'Isaac Duwe — Desenvolvedor & Builder'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 70,
          background: 'radial-gradient(circle at 78% 45%, #7c5cff 0%, #22d3ee22 30%, #05050a 62%)',
          color: '#f4f2ff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7 }}>isaac.dev</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 210, fontWeight: 800, letterSpacing: -12, lineHeight: 0.85 }}>ISAAC</div>
          <div style={{ fontSize: 40, marginTop: 24, opacity: 0.85 }}>16 anos · assistentes de voz, apps Android e web</div>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 26, opacity: 0.6 }}>
          <span>ELYSIUM</span>
          <span>ScrollYourBrain</span>
          <span>Manual ETEC</span>
          <span>CashUp</span>
        </div>
      </div>
    ),
    size,
  )
}
