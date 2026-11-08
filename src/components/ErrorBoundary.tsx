import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/**
 * Catches render errors and failed lazy chunk loads (e.g. a visitor on an
 * old tab after a redeploy) and offers a clean recovery instead of a blank page.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[portfolio] render error', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="container-page flex min-h-svh flex-col justify-center py-32">
        <p className="label mb-6 text-faint">Error</p>
        <h1 className="text-title font-semibold">Something went wrong.</h1>
        <p className="mt-6 max-w-md text-muted">
          The page could not be displayed. Reloading usually fixes this.
        </p>
        <div className="label mt-10 flex gap-8">
          <button
            type="button"
            className="link-underline cursor-pointer uppercase"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <a href="/" className="link-underline text-muted">
            Go to homepage
          </a>
        </div>
      </main>
    )
  }
}
