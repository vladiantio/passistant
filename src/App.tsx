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
import { ArrowUp, BrainCog, Settings2, Square, StarIcon } from 'lucide-react'
import { cn } from './lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { fixUnclosedTags } from './lib/markdown/utils'
import { t } from '@lingui/core/macro'
import { Button } from './ui/button'
import { DEFAULT_MODEL, SYSTEM_PROMPT } from './lib/llm/constants'
import { CircleProgress } from './ui/circle-progress'

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
      content: SYSTEM_PROMPT,
    },
  ])
  const [userMessages, setUserMessages] = useState<(ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState('')
  const [curMessage, setCurMessage] = useState('')
  const [enableThinking, setEnableThinking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

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
    <div className="p-5 flex flex-col justify-center min-h-dvh">
      {userMessages.length > 0 ? (
        <div className="overflow-y-auto h-[calc(100dvh-10rem)]">
          <div className="max-w-[800px] w-full mx-auto flex flex-col gap-5 mb-5">
            {userMessages.map((message, index) => (
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
      ) : (
        <div className="max-w-[800px] w-full mx-auto flex items-center justify-center flex-col gap-4 mb-16">
          <img src="/favicon.svg" alt="Logo" className="size-16" />
          <h1 className="text-2xl font-bold">{t`app.welcome`}</h1>
          <p className="text-muted-foreground text-center text-pretty">{t`app.welcomeDescription`}</p>
        </div>
      )}
      <PromptInput
        className="max-w-[800px] w-full mx-auto"
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
                  ? "bg-secondary/15 text-secondary hover:bg-secondary/20"
                  : "text-muted-foreground hover:bg-muted-foreground/15"
              )}
            >
              <BrainCog className="size-4" />
              {t`feature.reasoning`}
            </button>
            <PromptInputAction
              className="bg-secondary text-secondary-foreground"
              arrowClassName="bg-secondary fill-secondary"
              tooltip={t`button.settings`}
              disabled={false}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-full", showSettings && "!text-secondary")}
                onClick={() => setShowSettings(prev => !prev)}
              >
                <Settings2 className="size-4" />
              </Button>
            </PromptInputAction>
            {showSettings && (
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
            )}
            <PromptInputAction
              className="bg-secondary text-secondary-foreground"
              arrowClassName="bg-secondary fill-secondary"
              tooltip={t`button.github`}
              disabled={false}
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a href="https://github.com/vladiantio/passistant" target="_blank" rel="noopener noreferrer">
                  <StarIcon className="size-4" />
                </a>
              </Button>
            </PromptInputAction>
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
