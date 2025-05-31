import { useEffect, useState } from 'react'
import type { ChatCompletionMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from '@mlc-ai/web-llm'
import Markdown from 'markdown-to-jsx'
import { useMLCEngine } from './lib/llm/useMLCEngine'
import { useAvailableModels } from './lib/llm/useAvailableModels'
import { markdownOptions } from './lib/markdown/options'

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
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [curMessage, setCurMessage] = useState('')
  const [enableThinking, setEnableThinking] = useState(true)

  const handleConnect = () => {
    if (!selectedModel) return
    engine?.reload(selectedModel, {
      temperature: 0.7,
      top_p: 0.9,
    })
  }

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
    setLoading(true)

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
      setLoading(false)
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
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <button onClick={handleConnect}>Connect</button>
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
            <p 
              key={index} 
              className="p-2 my-2 rounded-lg"
              style={{
                backgroundColor: message.role === 'user' ? '#f0f0f0' : '#e3f2fd',
                textAlign: message.role === 'user' ? 'right' : 'left',
              }}
            >
              <strong>{message.role}:</strong>
              <Markdown options={markdownOptions}>{typeof message.content === 'string' ? message.content : ''}</Markdown>
            </p>
          ))}
        </div>
        <div className="flex gap-5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 min-h-[60px]"
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            className="py-2 px-4 text-white border-0 rounded-lg cursor-pointer disabled:cursor-not-allowed bg-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="flex gap-5">
          <label>
            Enable Thinking
            <input type="checkbox" checked={enableThinking} onChange={(e) => setEnableThinking(e.target.checked)} />
          </label>
        </div>
      </div>
    </div>
  )
}

export default App
