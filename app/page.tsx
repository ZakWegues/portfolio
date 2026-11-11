import Shell from '@/components/Shell'
import Hero, { Nav } from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Projects from '@/components/Projects'
import { About, Contact, GithubLive } from '@/components/Sections'
import { getGithub } from '@/lib/github'

export const revalidate = 3600

export default async function Home() {
  const gh = await getGithub()
  return (
    <Shell>
      <Nav />
      <main>
        <Hero commits={gh.commits} />
        <Marquee />
        <Projects />
        <GithubLive data={gh} />
        <About />
        <Contact />
      </main>
    </Shell>
  )
}
