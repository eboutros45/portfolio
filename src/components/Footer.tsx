import { ArrowUp } from 'lucide-react'
import { m, useReducedMotion } from 'motion/react'
import { site } from '../content/site'
import { useFitText } from '../hooks/useFitText'
import { scrollToTop } from '../lib/scroll'
import { LocalTime } from './LocalTime'
import { EASE } from './motion'

/** Footer: meta row, then the full name set edge to edge and cropped at the bottom. */
export function Footer() {
  const year = new Date().getFullYear()
  const wordmarkRef = useFitText<HTMLParagraphElement>()
  const reduce = useReducedMotion()

  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="container-page label grid-page items-center gap-y-4 py-8 text-faint">
        <p className="col-span-4 md:col-span-4">
          © {year} {site.name}
        </p>
        <p className="col-span-2 md:col-span-4">
          {site.location} · <LocalTime />
        </p>
        <p className="col-span-2 text-right md:col-span-4">
          <button
            type="button"
            onClick={() => scrollToTop()}
            className="group inline-flex cursor-pointer items-center gap-2 uppercase transition-colors hover:text-paper"
          >
            Back to top
            <ArrowUp
              aria-hidden
              className="size-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
            />
          </button>
        </p>
      </div>
      <div className="container-page">
        <p
          ref={wordmarkRef}
          aria-hidden
          className="-mb-[0.18em] text-[15vw] leading-[0.8] font-semibold tracking-[-0.055em] text-line-strong uppercase select-none"
        >
          <m.span
            data-fit-line
            className="inline-block whitespace-nowrap"
            initial={reduce ? false : { y: '40%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            Elie Boutros
          </m.span>
        </p>
      </div>
    </footer>
  )
}
