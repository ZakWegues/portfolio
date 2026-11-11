import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://portifolio-pearl.vercel.app'),
  title: 'Isaac Duwe — Desenvolvedor & Builder',
  description:
    'Portfólio de Isaac Duwe, 16 anos: assistente de voz para Windows e Android (ELYSIUM), app de estudo ScrollYourBrain, Manual ETEC e CashUp.',
  openGraph: {
    title: 'Isaac Duwe — Desenvolvedor & Builder',
    description: '16 anos, construindo produtos reais: assistentes de voz, apps Android e plataformas web.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport: Viewport = { themeColor: '#05050a' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${grotesk.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  )
}
