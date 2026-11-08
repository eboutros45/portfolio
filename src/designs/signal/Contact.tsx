import { ArrowUpRight, Mail } from 'lucide-react'
import { getContactLinks } from '../../content/site'
import { signalCopy } from './copy'
import { DevPlaceholder, Eyebrow } from './ui'

/** Email is the one filled button; LinkedIn/GitHub are secondary. Unset links are hidden. */
export function Contact({ active }: { active: boolean }) {
  const links = getContactLinks()
  const email = links.find((l) => l.key === 'email')!
  const others = links.filter((l) => l.key !== 'email')

  return (
    <section id="contact" aria-labelledby="sp-contact-title" className="sp-section">
      <div className="sp-wrap">
        <Eyebrow tp="TP5" active={active}>
          Contact
        </Eyebrow>
        <h2 id="sp-contact-title" className="sp-l2 mt-4 max-w-3xl">
          {signalCopy.contactTitle}
        </h2>
        <p className="sp-l4 mt-5">{signalCopy.contactBody}</p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {email.href ? (
            <a href={email.href} className="sp-btn sp-btn--primary">
              <Mail aria-hidden /> {email.display}
            </a>
          ) : (
            <DevPlaceholder>Email: placeholder (set in src/content/site.ts)</DevPlaceholder>
          )}
          {others.map((l) =>
            l.href ? (
              <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" className="sp-btn">
                {l.label} <ArrowUpRight aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <DevPlaceholder key={l.key}>{l.label}: placeholder</DevPlaceholder>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
