import shots from './shots.json'

export type Shot = { src: string; w: number; h: number; mobile: boolean }

export const person = {
  name: 'Isaac Duwe Rodrigues',
  firstName: 'Isaac',
  handle: 'ZakWegues',
  age: 16,
  title: 'Desenvolvedor & Builder',
  bio: [
    'Tenho 16 anos e construo produtos de verdade — assistente de voz que controla o PC, app Android que conversa com ele, rede social de estudo e sistemas para a escola.',
    'Estudo Desenvolvimento de Sistemas na ETEC Guaianases e aprendo do jeito que dá resultado: escolho um problema real, abro o editor e só paro quando está no ar.',
  ],
  location: 'Guaianases, São Paulo — SP',
  email: 'zakduwe@gmail.com',
  phone: '(11) 98161-5938',
  whatsapp: 'https://wa.me/5511981615938',
  github: 'https://github.com/ZakWegues',
}

export type Project = {
  slug: string
  index: string
  name: string
  kind: string
  tagline: string
  description: string
  year: string
  color: string
  color2: string
  stack: string[]
  highlights: string[]
  stats: { value: string; label: string }[]
  links: { label: string; href: string; primary?: boolean }[]
  device: 'laptop' | 'phone' | 'duo'
  shots: Shot[]
  phoneShots?: Shot[]
  phoneLabel?: string
}

const S = shots as Record<string, Shot[]>
const gh = (r: string) => `https://github.com/ZakWegues/${r}`

export const projects: Project[] = [
  {
    slug: 'elysium',
    index: '01',
    name: 'ELYSIUM',
    kind: 'Assistente de voz · Windows + Android',
    tagline: 'Um Jarvis de verdade, que mora no PC e anda no bolso.',
    description:
      'Assistente de voz em português que roda na bandeja do Windows: você aperta um atalho, fala, e ele executa — abre programas, organiza janelas, controla mídia, cria lembretes, lê o briefing do dia e gera telas interativas na hora. O ELYSIUM-M é o app Android que pareia com o PC por QR, conversa com a Ely e controla o computador de qualquer lugar pelo Tailscale.',
    year: '2026',
    color: '#F59E0B',
    color2: '#E11D48',
    stack: ['Electron', 'TypeScript', 'React Native', 'Expo', 'Groq', 'Gemini', 'Ollama', 'Tailscale'],
    highlights: [
      'Voz ponta a ponta: Whisper → LLM com ferramentas → TTS neural, com cérebro híbrido local (Ollama) e na nuvem',
      '25+ ações reais no Windows: apps, janelas, áudio, energia, Spotify, prints, arquivos',
      'Telas inteligentes: a IA gera calculadoras, quizzes, roteiros e gráficos interativos em tempo real',
      'App companion com pareamento por QR, TLS fixado, trackpad, widgets e notificações',
    ],
    stats: [
      { value: '620+', label: 'commits' },
      { value: 'v2.47', label: 'versão desktop' },
      { value: 'v2.10', label: 'versão Android' },
    ],
    links: [
      { label: 'Baixar p/ Windows', href: `${gh('elysium')}/releases/latest`, primary: true },
      { label: 'APK Android', href: `${gh('elysium-m')}/releases/latest` },
      { label: 'Código desktop', href: gh('elysium') },
      { label: 'Código mobile', href: gh('elysium-m') },
    ],
    device: 'duo',
    shots: S['elysium'],
    phoneShots: S['elysium-m'],
    phoneLabel: 'Telas geradas pela Ely',
  },
  {
    slug: 'scrollyourbrain',
    index: '02',
    name: 'ScrollYourBrain',
    kind: 'App Android · Educação',
    tagline: 'Estude no ritmo do scroll.',
    description:
      'Um feed vertical no estilo Reels/Shorts feito só de conteúdo do ensino médio, ENEM e vestibular. Quiz, flashcards, aulas guiadas e simulados — o feed aprende com você e foca no que você mais erra. Funciona offline.',
    year: '2026',
    color: '#8B5CF6',
    color2: '#22D3EE',
    stack: ['React Native', 'Expo SDK 57', 'TypeScript', 'GitHub Actions'],
    highlights: [
      '1.300+ cards em 10 matérias × 3 séries × 4 bimestres, com geradores de questões',
      'Modos de prova: ENEM por área, vestibular, bimestral, simulado dos pontos fracos',
      'Revisão espaçada (SM-2), caderno de erros e quiz relâmpago de 60 s',
      'APK gerado automaticamente a cada push pelo CI',
    ],
    stats: [
      { value: '1.300+', label: 'cards' },
      { value: '56', label: 'contas de matéria' },
      { value: '100%', label: 'offline' },
    ],
    links: [
      { label: 'Baixar APK', href: `${gh('ScrollYourBrain')}/releases/latest/download/ScrollYourBrain.apk`, primary: true },
      { label: 'Código', href: gh('ScrollYourBrain') },
    ],
    device: 'phone',
    shots: S['scrollyourbrain'],
  },
  {
    slug: 'manual-etec',
    index: '03',
    name: 'Manual ETEC',
    kind: 'Web app · Plataforma escolar',
    tagline: 'A sala inteira organizada em um lugar só.',
    description:
      'Plataforma para os alunos da ETEC acompanharem aulas, atividades e prazos: cronograma semanal, calendário, notas, modo foco, ranking da turma, materiais de estudo e assistente de IA. Tem painel de administração completo e versão mobile.',
    year: '2026',
    color: '#3B82F6',
    color2: '#10B981',
    stack: ['React', 'TypeScript', 'Supabase', 'Tailwind', 'shadcn/ui', 'Expo'],
    highlights: [
      'Dashboard com atividades pendentes, progresso e assistente de IA',
      'Ranking gamificado por pontualidade e notas',
      'Painel admin: matérias, atividades, métricas e feedback',
      'PWA instalável + app mobile com Expo e Drizzle',
    ],
    stats: [
      { value: '137', label: 'commits' },
      { value: '20+', label: 'telas' },
      { value: 'PWA', label: 'instalável' },
    ],
    links: [
      { label: 'Código web', href: gh('manual-etec'), primary: true },
      { label: 'Código mobile', href: gh('manual-etec-mobile') },
    ],
    device: 'laptop',
    shots: S['manual-etec'].filter((s) => !s.mobile),
    phoneShots: S['manual-etec'].filter((s) => s.mobile),
  },
  {
    slug: 'cashup',
    index: '04',
    name: 'CashUp',
    kind: 'Produto · Landing + cardápio digital',
    tagline: 'Doces que vendem sozinhos.',
    description:
      'Sistema de pedidos via WhatsApp para docerias e confeitarias: o cliente monta o pedido no cardápio digital e a mensagem chega pronta no WhatsApp da loja. Sem taxa por pedido, sem app de delivery. Landing premium com planos, blog e captação de leads.',
    year: '2026',
    color: '#F87171',
    color2: '#FDBA74',
    stack: ['React', 'Vite', 'Framer Motion', 'Supabase', 'CSS'],
    highlights: [
      'Cardápio digital com pedido em 1 toque direto no WhatsApp',
      'Landing com mockup animado, planos e formulário de leads',
      'Painel admin com exportação CSV',
      'Design system próprio, mobile-first',
    ],
    stats: [
      { value: '0%', label: 'taxa por pedido' },
      { value: '7 dias', label: 'pra ficar pronto' },
      { value: '3', label: 'planos' },
    ],
    links: [{ label: 'Código', href: gh('cashup'), primary: true }],
    device: 'laptop',
    shots: S['cashup'].filter((s) => !s.mobile),
    phoneShots: S['cashup'].filter((s) => s.mobile),
  },
]

export const stackMarquee = [
  'TypeScript', 'React', 'React Native', 'Expo', 'Electron', 'Next.js', 'Node.js', 'Supabase',
  'Tailwind', 'Vite', 'Groq', 'Gemini', 'Ollama', 'Java', 'Git', 'GitHub Actions', 'Figma',
]

export const skills = [
  { group: 'Front', items: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'] },
  { group: 'Mobile', items: ['React Native', 'Expo', 'Módulos nativos', 'APK com CI'] },
  { group: 'Desktop', items: ['Electron', 'Node.js', 'PowerShell', 'IPC/RPC'] },
  { group: 'Back & IA', items: ['Supabase', 'Express', 'LLMs + tools', 'STT/TTS', 'Ollama'] },
]

export const education = {
  institution: 'ETEC Guaianases',
  course: 'Técnico em Desenvolvimento de Sistemas',
  note: 'Integrado ao Ensino Médio',
  period: '2024 – 2027',
}

export const languages = [
  { name: 'Português', level: 'Nativo' },
  { name: 'Inglês', level: 'Intermediário' },
]
