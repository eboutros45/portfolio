import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { DesignId } from '../content/designs'
import { applyDesign, saveDesign } from '../lib/design'

interface DesignState {
  design: DesignId
  setDesign: (id: DesignId) => void
}

const DesignContext = createContext<DesignState | null>(null)

export function DesignProvider({ initial, children }: { initial: DesignId; children: ReactNode }) {
  const [design, set] = useState(initial)
  const setDesign = useCallback((id: DesignId) => {
    applyDesign(id)
    saveDesign(id)
    set(id)
  }, [])
  return <DesignContext.Provider value={{ design, setDesign }}>{children}</DesignContext.Provider>
}

export function useDesign() {
  const ctx = useContext(DesignContext)
  if (!ctx) throw new Error('useDesign must be used inside <DesignProvider>')
  return ctx
}
