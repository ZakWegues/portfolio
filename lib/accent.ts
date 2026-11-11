// Cor de destaque global: o orb 3D e as variáveis CSS seguem o projeto em foco.
type Accent = { a: string; b: string }
const listeners = new Set<(c: Accent) => void>()
let current: Accent = { a: '#7C5CFF', b: '#22D3EE' }

export const DEFAULT_ACCENT: Accent = { a: '#7C5CFF', b: '#22D3EE' }

export function setAccent(a: string, b: string) {
  if (current.a === a && current.b === b) return
  current = { a, b }
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--accent', a)
    document.documentElement.style.setProperty('--accent-2', b)
  }
  listeners.forEach((l) => l(current))
}

export function getAccent() {
  return current
}

export function onAccent(fn: (c: Accent) => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
