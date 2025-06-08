import type { ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from '@mlc-ai/web-llm'
import Markdown from 'markdown-to-jsx'
import { cn } from '../lib/utils'
import { markdownOptions } from '../lib/markdown/options'
import { CircleProgress } from '../ui/circle-progress'

interface ChatMessagesProps {
  messages: (ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)[]
  initProgressReport: {
    progress: number
    text: string
  } | null
}

export function ChatMessages({ messages, initProgressReport }: ChatMessagesProps) {
  return (
    <div className="overflow-y-auto h-[calc(100dvh-10rem)]">
      <div className="max-w-[800px] w-full mx-auto flex flex-col gap-5 mb-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex", message.role === 'user' && "justify-end")}
          >
            <div
              className={cn(
                "markdown-content",
                message.role === 'user' && "bg-input/40 max-w-[70%] px-5 py-2.5 rounded-3xl"
              )}
            >
              <Markdown options={markdownOptions}>{typeof message.content === 'string' ? message.content : ''}</Markdown>
            </div>
          </div>
        ))}
        {initProgressReport && initProgressReport.progress < 1 && (
          <div className="flex gap-2 items-center">
            <CircleProgress
              value={initProgressReport.progress}
              maxValue={1}
              size={24}
              suffix="%"
              useGradient
            />
            <p className="text-sm text-muted-foreground">{initProgressReport.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}
