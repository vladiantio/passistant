import { useEffect, useState } from 'react'
import { MLCEngine, prebuiltAppConfig, type InitProgressReport, type ChatCompletionMessageParam } from '@mlc-ai/web-llm'

const DEFAULT_MODEL = 'Qwen3-0.6B-q4f32_1-MLC'
const SYSTEM_PROMPT = 'You are a helpful multilingual password assistant. Generate a password that balance cryptographic strength with ease of reading and memorization for most users. The password should be at least 12 characters long. Do not include any spaces or other special characters.'

function useMLCEngine() {
  const [engine, setEngine] = useState<MLCEngine | null>(null)
  const [initProgressReport, setInitProgressReport] = useState<InitProgressReport | null>(null)

  useEffect(() => {
    const engine = new MLCEngine()
    engine.setInitProgressCallback((report) => {
      setInitProgressReport(report)
    })
    setEngine(engine)
  }, [])

  return { engine, initProgressReport }
}

function useAvailableModels() {
  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    const modelList = prebuiltAppConfig.model_list.map((m) => m.model_id)
    setModels(modelList)
  }, [])

  return models
}

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
  const [userMessages, setUserMessages] = useState<ChatCompletionMessageParam[]>([])
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
    
    const message: ChatCompletionMessageParam = {
      role: 'user',
      content: input,
    }
    
    const newMessages = [...messages, message]
    setMessages(newMessages)
    const aiMessage: ChatCompletionMessageParam = {
      role: 'assistant',
      content: 'typing...',
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
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
        <div style={{ marginBottom: '20px' }}>
          <p>{initProgressReport.text}</p>
          {initProgressReport.progress < 1 && <progress value={initProgressReport.progress} />}
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          {userMessages.map((message, index) => (
            <p 
              key={index} 
              style={{
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                backgroundColor: message.role === 'user' ? '#f0f0f0' : '#e3f2fd',
                textAlign: message.role === 'user' ? 'right' : 'left',
                whiteSpace: 'pre-wrap',
              }}
            >
              <strong>{message.role}:</strong> {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
            </p>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: '8px', minHeight: '60px' }}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: (loading || !input.trim()) ? '#cccccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
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
