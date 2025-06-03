import { useEffect, useState } from 'react'
import type { ChatCompletionMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from '@mlc-ai/web-llm'
import Markdown from 'markdown-to-jsx'
import { useMLCEngine } from './lib/llm/useMLCEngine'
import { useAvailableModels } from './lib/llm/useAvailableModels'
import { markdownOptions } from './lib/markdown/options'
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputSubmitButton,
  PromptInputTextarea,
} from './ui/prompt-input'
import { ArrowUp, BrainCog, Square } from 'lucide-react'
import { cn } from './lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { fixUnclosedTags } from './lib/markdown/utils'
import { t } from '@lingui/core/macro'

const DEFAULT_MODEL = 'Qwen3-0.6B-q4f32_1-MLC'

function App() {
  const {
    engine,
    initProgressReport,
    loadModel,
    currentModel,
    isModelLoading,
  } = useMLCEngine()
  const availableModels = useAvailableModels()
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    {
      role: 'system',
      content: t`system.prompt`,
    },
  ])
  const [userMessages, setUserMessages] = useState<(ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState('')
  const [curMessage, setCurMessage] = useState('')
  const [enableThinking, setEnableThinking] = useState(true)

  const handleSend = async () => {
    if (!engine) return

    if (isTyping) {
      await engine.interruptGenerate()
      return
    }

    if (!input.trim() || !selectedModel || isModelLoading) return
    
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

    if (currentModel != selectedModel) {
      const success = await loadModel(selectedModel)
      if (!success) return
    }

    setIsTyping(true)
    try {
      const completion = await engine.chat.completions.create({
        stream: true,
        stream_options: {
          include_usage: true,
        },
        messages: newMessages,
        model: selectedModel,
        temperature: 0.5,
        top_p: 0.9,
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
      setUserMessages(prev => prev.map((message, i) => i === prev.length - 1 ? { ...message, content: fixUnclosedTags(curMessage) } : message))
    }
  }, [curMessage])

  return (
    <div className="max-w-[800px] mx-auto p-5 flex flex-col justify-center min-h-dvh">
      {userMessages.length > 0 ? (
        <div className="mb-5 overflow-y-auto h-[calc(100dvh-10rem)]">
          {userMessages.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === 'user' && "justify-end")}
            >
              <div
                className={cn(
                  "p-2 my-2 rounded-lg markdown-content",
                  message.role === 'user' && "bg-input/40 max-w-1/2"
                )}
              >
                <Markdown options={markdownOptions}>{typeof message.content === 'string' ? message.content : ''}</Markdown>
              </div>
            </div>
          ))}
          {initProgressReport && initProgressReport.progress < 1 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{initProgressReport.text}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all" 
                  style={{ width: `${initProgressReport.progress * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col gap-4 mb-16">
          <div className="flex items-center gap-4">
            <img src="/favicon.svg" alt="Logo" className="size-16" />
            <h1 className="text-2xl font-bold">{t`app.welcome`}</h1>
          </div>
          <p className="text-muted-foreground">{t`app.welcomeDescription`}</p>
        </div>
      )}
      <PromptInput
        value={input}
        onValueChange={(value) => setInput(value)}
        onSubmit={handleSend}
        disabled={(!input.trim() || !selectedModel || isModelLoading) && !isTyping}
      >
        <PromptInputTextarea
          placeholder={t`ui.prompt.placeholder`}
        />
        <PromptInputActions className="justify-between">
          <div className="flex items-center">
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
              {t`feature.reasoning`}
            </button>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
            >
              <SelectTrigger className="border-0 dark:bg-transparent shadow-none rounded-full">
                <SelectValue placeholder={t`placeholder.model`} />
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
          <PromptInputAction
            tooltip={isTyping ? t`button.stop` : t`button.send`}
          >
            <PromptInputSubmitButton
              variant="default"
              size="icon"
              className="rounded-full"
            >
              {isTyping ? (
                <Square className="size-5 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </PromptInputSubmitButton>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </div>
  )
}

export default App
