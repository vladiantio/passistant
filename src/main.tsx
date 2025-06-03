import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/app.css'
import App from './App.tsx'
import { ThemeProvider } from './providers/theme-provider'
import { I18nProvider } from './i18n/i18n-provider.tsx'
import { detectLocale } from './i18n/languages.ts'
import { dynamicActivate } from './i18n/i18n.ts'

// Set the locale and activate it
const locale = detectLocale()
await dynamicActivate(locale)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
