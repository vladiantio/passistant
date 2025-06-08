import { useEffect, useState, useCallback } from 'react'
import type { WebWorkerMLCEngine, InitProgressReport } from '@mlc-ai/web-llm'
import { checkGPUAvailability } from '@/utils/navigator'

export function useMLCEngine() {
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null)
  const [initProgressReport, setInitProgressReport] = useState<InitProgressReport | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isWebGPUAvailable, setIsWebGPUAvailable] = useState<boolean | null>(null)

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
        // Check WebGPU availability first
        const hasWebGPU = await checkGPUAvailability();
        setIsWebGPUAvailable(hasWebGPU);

        if (!hasWebGPU) {
          throw new Error('WebGPU is not available on this system. Please check if your browser supports WebGPU and if your GPU is properly configured.');
        }

        const { WebWorkerMLCEngine } = await import('@mlc-ai/web-llm')
        const engine = new WebWorkerMLCEngine(
          new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
          {
            initProgressCallback: (report) => {
              setInitProgressReport(report)
            }
          }
        )
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
    loadModel,
    isWebGPUAvailable,
  }
}
