import { ChatPage } from "./features/chat/chat-page"
import { ThemeProvider } from "./providers/theme-provider"

export function App() {
  return (
    <ThemeProvider>
      <ChatPage />
    </ThemeProvider>
  )
}
