import { ArrowUpRight } from 'lucide-react'
import { getContactLinks, type ContactLink } from '../content/site'
import { Magnetic } from '../components/Magnetic'
import { Reveal, SplitLetters } from '../components/motion'

/**
 * Links that are still placeholders (null in src/content/site.ts) are hidden
 * in production and shown as dashed markers in development.
 */
function Placeholder({ link }: { link: ContactLink }) {
  if (!import.meta.env.DEV) return null
  return (
    <li className="label border border-dashed border-faint px-3 py-2 text-faint">
      {link.label}: placeholder (set in src/content/site.ts)
    </li>
  )
}

export function Contact() {
  const links = getContactLinks()
  const email = links.find((l) => l.key === 'email')!
  const others = links.filter((l) => l.key !== 'email')

  return (
    <section id="contact" aria-labelledby="contact-title" className="container-page pt-24 pb-20 md:pt-40 md:pb-28">
      <p className="label mb-10 flex gap-4 text-paper">
        <span className="text-faint">(06)</span> Contact
      </p>
      {/* Hover the heading: letters ripple upward */}
      <h2
        id="contact-title"
        aria-label="Let's connect."
        className="group/wave w-fit cursor-default text-headline font-semibold uppercase"
      >
        <SplitLetters text={'Let’s'} stagger={0.04} wave />
        <SplitLetters text="Connect." delay={0.15} stagger={0.04} accentLast wave />
      </h2>

      <div className="grid-page mt-14 gap-y-10 md:mt-20">
        <Reveal className="col-span-4 md:col-span-5">
          <p className="max-w-md text-lg leading-relaxed text-muted md:text-xl">
            Interested in software engineering opportunities, collaborations, and building useful products.
          </p>
        </Reveal>

        <Reveal className="col-span-4 md:col-span-6 md:col-start-7" delay={0.1}>
          {email.href ? (
            <Magnetic strength={0.12}>
              <a
                href={email.href}
                className="group relative inline-flex max-w-full items-center gap-4 overflow-hidden rounded-full border border-paper py-4 pr-4 pl-7 text-xl font-medium tracking-[-0.02em] break-all md:text-3xl"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
                />
                <span className="relative transition-colors duration-500 group-hover:text-ink">{email.display}</span>
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-accent text-ink md:size-12">
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 transition-transform duration-500 ease-out-expo group-hover:rotate-45"
                  />
                </span>
              </a>
            </Magnetic>
          ) : (
            import.meta.env.DEV && (
              <ul>
                <Placeholder link={email} />
              </ul>
            )
          )}

          <ul className="label mt-8 flex flex-wrap gap-x-8 gap-y-3 text-muted">
            {others.map((l) =>
              l.href ? (
                <li key={l.key}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-paper"
                  >
                    <span className="link-underline">{l.label}</span>
                    <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ) : (
                <Placeholder key={l.key} link={l} />
              ),
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
