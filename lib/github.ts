const USER = 'ZakWegues'
const API = 'https://api.github.com'
const FEATURED = ['elysium', 'elysium-m', 'ScrollYourBrain', 'manual-etec', 'cashup']

export type GithubData = {
  repos: number
  stars: number
  commits: number
  languages: { name: string; pct: number }[]
  recent: { repo: string; message: string; date: string }[]
  live: boolean
}

const FALLBACK: GithubData = {
  repos: 14,
  stars: 3,
  commits: 790,
  languages: [
    { name: 'TypeScript', pct: 78 },
    { name: 'JavaScript', pct: 8 },
    { name: 'HTML', pct: 6 },
    { name: 'Java', pct: 4 },
    { name: 'CSS', pct: 4 },
  ],
  recent: [],
  live: false,
}

async function gh(path: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`${API}${path}`, { headers, next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`${path} ${res.status}`)
  return res
}

async function commitCount(repo: string): Promise<number> {
  const res = await gh(`/repos/${USER}/${repo}/commits?per_page=1`)
  const last = res.headers.get('link')?.match(/page=(\d+)>; rel="last"/)
  return last ? Number(last[1]) : (await res.json()).length
}

export async function getGithub(): Promise<GithubData> {
  try {
    const [reposRes, eventsRes, counts, langs] = await Promise.all([
      gh(`/users/${USER}/repos?per_page=100&sort=pushed`),
      gh(`/users/${USER}/events/public?per_page=60`).catch(() => null),
      Promise.all(FEATURED.map((r) => commitCount(r).catch(() => 0))),
      Promise.all(FEATURED.map((r) => gh(`/repos/${USER}/${r}/languages`).then((x) => x.json() as Promise<Record<string, number>>).catch(() => ({})))),
    ])
    const repos = (await reposRes.json()) as { fork: boolean; stargazers_count: number; name: string }[]
    const own = repos.filter((r) => !r.fork)

    const bytes = new Map<string, number>()
    for (const l of langs) for (const [k, v] of Object.entries(l)) bytes.set(k, (bytes.get(k) ?? 0) + v)
    const total = [...bytes.values()].reduce((a, b) => a + b, 0) || 1
    const languages = [...bytes.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, v]) => ({ name, pct: Math.max(1, Math.round((v / total) * 100)) }))

    type Ev = { type: string; repo: { name: string }; created_at: string; payload: { commits?: { message: string }[]; ref?: string } }
    const events = eventsRes ? ((await eventsRes.json()) as Ev[]) : []
    const recent = events
      .filter((e) => e.type === 'PushEvent')
      .slice(0, 6)
      .map((e) => ({
        repo: e.repo.name.replace(`${USER}/`, ''),
        message: e.payload.commits?.at(-1)?.message.split('\n')[0] ?? 'novos commits enviados',
        date: e.created_at,
      }))

    const commits = counts.reduce((a, b) => a + b, 0)
    return {
      repos: own.length,
      stars: own.reduce((a, r) => a + r.stargazers_count, 0),
      commits: commits || FALLBACK.commits,
      languages: languages.length ? languages : FALLBACK.languages,
      recent,
      live: true,
    }
  } catch {
    return FALLBACK
  }
}
