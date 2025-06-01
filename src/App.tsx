import { useEffect, useState } from 'react'
import type { ChatCompletionMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from '@mlc-ai/web-llm'
import Markdown from 'markdown-to-jsx'
import { useMLCEngine } from './lib/llm/useMLCEngine'
import { useAvailableModels } from './lib/llm/useAvailableModels'
import { markdownOptions } from './lib/markdown/options'
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from './ui/prompt-input'
import { Button } from './ui/button'
import { ArrowUp, BrainCog, Square } from 'lucide-react'
import { cn } from './lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const DEFAULT_MODEL = 'Qwen3-0.6B-q4f32_1-MLC'
const SYSTEM_PROMPT = `Act as Passistant, an AI-powered password assistant, specialized in creating passwords that are both secure and memorable.
Your task is to generate 5 unique passwords that strike a balance between cryptographic strength and ease of memorability for average users.

Requirements for each password:
- They must be at least 12 characters long.
- Include uppercase letters, lowercase letters, numbers and special characters.
- Be easily readable and memorable, without relying on personal information.
- Each password must be enclosed inside the <pass></pass> tag without formatting for easy identification and automatic use.`

function App() {
  const { engine, initProgressReport } = useMLCEngine()
  const availableModels = useAvailableModels()
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
  ])
  const [userMessages, setUserMessages] = useState<(ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState('')
  const [curMessage, setCurMessage] = useState('')
  const [enableThinking, setEnableThinking] = useState(true)

  const handleSend = async () => {
    if (!engine) return
    if (!input.trim() || !selectedModel) return
    
    const message: ChatCompletionUserMessageParam = {
      role: 'user',
      content: input,
    }
    
    const newMessages = [...messages, message]
    setMessages(newMessages)
    const aiMessage: ChatCompletionAssistantMessageParam = {
      role: 'assistant',
      content: '<loading />',
    };
    setUserMessages(prev => [
      ...prev,
      message,
      aiMessage,
    ])
    setInput('')
    setIsTyping(true)

    try {
      const completion = await engine.chat.completions.create({
        stream: true,
        stream_options: {
          include_usage: true,
        },
        messages: newMessages,
        model: selectedModel,
        extra_body: {
          enable_thinking: enableThinking,
        },
      })

      if (!completion) {
        throw new Error('Completion is undefined')
      }

      setCurMessage('')
      for await (const chunk of completion) {
        const curDelta = chunk.choices[0]?.delta?.content
        if (curDelta) {
          setCurMessage(prev => prev + curDelta)
        }
      }
      const finalMessage = await engine.getMessage();
      setCurMessage(finalMessage);
    } catch (error) {
      console.error('Error generating completion:', error)
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    if (curMessage) {
      setUserMessages(prev => prev.map((message, i) => i === prev.length - 1 ? { ...message, content: curMessage } : message))
    }
  }, [curMessage])

  return (
    <div className="max-w-[800px] mx-auto p-5">
      <div className="mb-5">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="border-0 dark:bg-transparent">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {initProgressReport && (
        <div className="mb-5">
          <p>{initProgressReport.text}</p>
          {initProgressReport.progress < 1 && <progress value={initProgressReport.progress} />}
        </div>
      )}
      <div className="mb-5">
        <div className="mb-5">
          {userMessages.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === 'user' && "justify-end")}
            >
              <p 
                className={cn(
                  "p-2 my-2 rounded-lg",
                  message.role === 'user' && "bg-input/40 w-1/2"
                )}
              >
                <Markdown options={markdownOptions}>{typeof message.content === 'string' ? message.content : ''}</Markdown>
              </p>
            </div>
          ))}
        </div>
        <PromptInput
          value={input}
          onValueChange={(value) => setInput(value)}
          onSubmit={handleSend}
        >
          <PromptInputTextarea
            placeholder="Type your message..."
          />
          <PromptInputActions className="justify-between">
            <button
              type="button"
              onClick={() => setEnableThinking(prev => !prev)}
              className={cn(
                "rounded-full transition-all flex items-center gap-2 px-3 py-2 h-9",
                enableThinking
                  ? "bg-primary/15 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:bg-muted-foreground/15"
              )}
            >
              <BrainCog className="size-4" />
              Thinking
            </button>
            <PromptInputAction
              tooltip={isTyping ? "Stop generation" : "Send message"}
            >
              <Button
                variant="default"
                size="icon"
                className="rounded-full"
                onClick={handleSend}
                disabled={!input.trim() && !isTyping}
              >
                {isTyping ? (
                  <Square className="size-5 fill-current" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  )
}

export default App
