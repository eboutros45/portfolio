import { Marquee } from '../components/Marquee'
import { about } from '../content/profile'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { About } from '../sections/About'
import { Background } from '../sections/Background'
import { Contact } from '../sections/Contact'
import { Explorations } from '../sections/Explorations'
import { Hero } from '../sections/Hero'
import { SelectedWork } from '../sections/SelectedWork'
import { Skills } from '../sections/Skills'

export default function Home() {
  useDocumentMeta('/')
  return (
    <main id="main">
      <Hero />
      <Marquee items={about.interests} />
      <SelectedWork />
      <Explorations />
      <About />
      <Background />
      <Skills />
      <Contact />
    </main>
  )
}
