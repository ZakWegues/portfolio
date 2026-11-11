# Portfólio — Isaac Duwe

Portfólio pessoal: [portifolio-pearl.vercel.app](https://portifolio-pearl.vercel.app)

Next.js 15 + TypeScript + Tailwind 4, com um orb de partículas em three.js (react-three-fiber), scroll suave com Lenis, seção de projetos em scroll horizontal com GSAP ScrollTrigger e dados do GitHub atualizados a cada hora.

Tem um terminal escondido: aperte `'` em qualquer lugar da página.

## Rodar

```bash
npm install
npm run dev
```

## Estrutura

- `lib/data.ts` — textos, projetos e links
- `lib/shots.json` — prints dos apps (em `public/projects/`)
- `lib/github.ts` — dados do GitHub (opcional: `GITHUB_TOKEN` para limite maior de requisições)
- `components/` — Orb, Hero, Projects, Devices, Sections, Terminal
