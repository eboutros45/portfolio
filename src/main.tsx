import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { DesignProvider } from './components/DesignProvider'
import { initThemePreview } from './components/ThemePicker'
import { initDesign } from './lib/design'

const showThemePicker = initThemePreview()
const design = initDesign()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DesignProvider initial={design}>
        <App showThemePicker={showThemePicker} />
      </DesignProvider>
    </BrowserRouter>
  </StrictMode>,
)
