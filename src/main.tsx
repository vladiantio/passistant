import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./i18n"
import "./styles/app.css"
import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
