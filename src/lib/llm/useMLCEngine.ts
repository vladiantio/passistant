import { useEffect, useState, useCallback } from 'react'
import type { MLCEngine, InitProgressReport } from '@mlc-ai/web-llm'

export function useMLCEngine() {
  const [engine, setEngine] = useState<MLCEngine | null>(null)
  const [initProgressReport, setInitProgressReport] = useState<InitProgressReport | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const loadModel = useCallback(async (model: string) => {
    if (!engine) return false;
    
    try {
      setIsModelLoading(true)
      setError(null)
      await engine.reload(model)
      setCurrentModel(model)
      return true
    } catch (err) {
      console.error('Error loading model:', err)
      setError(err instanceof Error ? err : new Error('Failed to load model'))
      return false
    } finally {
      setIsModelLoading(false)
    }
  }, [engine])

  useEffect(() => {
    const init = async () => {
      try {
        const { MLCEngine } = await import('@mlc-ai/web-llm')
        const engine = new MLCEngine()
        engine.setInitProgressCallback((report) => {
          setInitProgressReport(report)
        })
        setEngine(engine)
      } catch (err) {
        console.error('Error initializing MLCEngine:', err)
        setError(err instanceof Error ? err : new Error('Failed to initialize MLCEngine'))
      }
    }
    init()
  }, [])

  return { 
    engine, 
    initProgressReport, 
    isModelLoading,
    currentModel,
    error,
    loadModel 
  }
}
