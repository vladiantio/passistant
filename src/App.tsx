import { useEffect, useState } from 'react'
import type { ChatCompletionMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from '@mlc-ai/web-llm'
import { useMLCEngine } from './lib/llm/useMLCEngine'
import { useAvailableModels } from './lib/llm/useAvailableModels'
import { fixUnclosedTags } from './lib/markdown/utils'
import { DEFAULT_MODEL, SYSTEM_PROMPT } from './lib/llm/constants'
import { ChatMessages } from './components/ChatMessages'
import { WelcomeScreen } from './components/WelcomeScreen'
import { SettingsPanel } from './components/SettingsPanel'
import { ChatInput } from './components/ChatInput'

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
        <ChatMessages
          messages={userMessages}
          initProgressReport={initProgressReport}
        />
      ) : (
        <WelcomeScreen />
      )}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSend}
        isTyping={isTyping}
        disabled={(!input.trim() || !selectedModel || isModelLoading) && !isTyping}
      >
        <SettingsPanel
          selectedModel={selectedModel}
          availableModels={availableModels}
          onModelChange={setSelectedModel}
          enableThinking={enableThinking}
          onEnableThinkingChange={setEnableThinking}
          showSettings={showSettings}
          onShowSettingsChange={setShowSettings}
        />
      </ChatInput>
    </div>
  )
}

export default App
