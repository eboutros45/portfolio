import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from 'motion/react'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { getCaseStudy, getProject } from './content/projects'
import { site } from './content/site'
import { useDesign } from './components/DesignProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { SmoothScroll } from './components/SmoothScroll'
import { ThemePicker } from './components/ThemePicker'
import { loadProjectPage } from './lib/routes'
import { scrollToIdWhenReady, scrollToTop } from './lib/scroll'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Case studies are code-split and prefetched on hover/focus of their links.
const ProjectPage = lazy(loadProjectPage)
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))

// Signal Path design: its code, fonts and styles load only when it is shown.
const signal = {
  Home: lazy(() => import('./designs/signal/Home')),
  Project: lazy(() => import('./designs/signal/Article').then((m) => ({ default: m.SignalProjectPage }))),
  CaseStudy: lazy(() => import('./designs/signal/Article').then((m) => ({ default: m.SignalCaseStudyPage }))),
  NotFound: lazy(() => import('./designs/signal/NotFound')),
  Nav: lazy(() => import('./designs/signal/Nav')),
  Footer: lazy(() => import('./designs/signal/Footer')),
}

/** Shown only if a case-study chunk is slow to arrive. */
function PageFallback() {
  return (
    <div className="container-page flex min-h-svh items-center" role="status" aria-live="polite">
      <span className="label text-faint">Loading…</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Curtain page transition                                            */
/*  exit:  a panel rises from the bottom and covers the old page       */
/*  enter: the panel lifts off the top, revealing the new page         */
/* ------------------------------------------------------------------ */
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const

const page: Variants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 } },
  // Hold the old page in place until its covering curtain has finished.
  exit: { opacity: 1, transition: { duration: 0.5 } },
}
const cover: Variants = {
  initial: { scaleY: 0 },
  enter: { scaleY: 0 },
  exit: { scaleY: 1, transition: { duration: 0.5, ease: CURTAIN_EASE } },
}
const reveal: Variants = {
  initial: { scaleY: 1 },
  enter: { scaleY: 0, transition: { duration: 0.6, ease: CURTAIN_EASE, delay: 0.1 } },
  exit: { scaleY: 0 },
}
const curtainLabel: Variants = {
  initial: { opacity: 1, y: 0 },
  enter: { opacity: 0, y: -16, transition: { duration: 0.35, ease: 'easeIn' } },
  exit: { opacity: 0 },
}

function pageLabel(pathname: string) {
  const match = pathname.match(/^\/projects\/([^/]+)/)
  const study = pathname.match(/^\/case-studies\/([^/]+)/)
  return (match && getProject(match[1])?.name) || (study && getCaseStudy(study[1])?.title) || site.name
}

export default function App({ showThemePicker = false }: { showThemePicker?: boolean }) {
  const location = useLocation()
  const { design } = useDesign()
  const isSignal = design === 'signal'

  // Initial load: honour a deep link like /#about once content has rendered.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (location.hash) scrollToIdWhenReady(location.hash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // While the curtain covers the screen: jump to the hash target, or the top.
  const onExitComplete = () => {
    if (location.hash) scrollToIdWhenReady(location.hash)
    else scrollToTop(true)
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        <a
          href="#main"
          className="label fixed top-3 left-3 z-[80] -translate-y-20 bg-paper px-4 py-3 text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        {isSignal ? (
          <Suspense fallback={null}>
            <signal.Nav />
          </Suspense>
        ) : (
          <Nav />
        )}
        {showThemePicker && !isSignal && <ThemePicker />}
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
            <m.div key={location.pathname} initial="initial" animate="enter" exit="exit">
              <m.div variants={page}>
                <Suspense fallback={<PageFallback />}>
                  <Routes location={location}>
                    <Route path="/" element={isSignal ? <signal.Home /> : <Home />} />
                    <Route path="/projects/:slug" element={isSignal ? <signal.Project /> : <ProjectPage />} />
                    <Route
                      path="/case-studies/:slug"
                      element={isSignal ? <signal.CaseStudy /> : <CaseStudyPage />}
                    />
                    <Route path="*" element={isSignal ? <signal.NotFound /> : <NotFound />} />
                  </Routes>
                </Suspense>
                {isSignal ? (
                  <Suspense fallback={null}>
                    <signal.Footer />
                  </Suspense>
                ) : (
                  <Footer />
                )}
              </m.div>

              <m.div
                aria-hidden
                variants={cover}
                className="pointer-events-none fixed inset-0 z-[70] origin-bottom border-t border-line-strong bg-curtain"
              />
              <m.div
                aria-hidden
                variants={reveal}
                className="pointer-events-none fixed inset-0 z-[70] origin-top border-b border-line-strong bg-curtain"
              />
              <m.p
                aria-hidden
                variants={curtainLabel}
                className="pointer-events-none fixed inset-0 z-[71] flex items-center justify-center text-curtain-text text-2xl font-semibold tracking-[-0.03em] md:text-4xl"
              >
                {pageLabel(location.pathname)}
              </m.p>
            </m.div>
          </AnimatePresence>
        </ErrorBoundary>
      </MotionConfig>
    </LazyMotion>
  )
}
