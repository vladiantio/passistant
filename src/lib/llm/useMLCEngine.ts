import { useEffect, useState } from 'react'
import type { MLCEngine, InitProgressReport } from '@mlc-ai/web-llm'

export function useMLCEngine() {
  const [engine, setEngine] = useState<MLCEngine | null>(null)
  const [initProgressReport, setInitProgressReport] = useState<InitProgressReport | null>(null)

  useEffect(() => {
    const init = async () => {
      const { MLCEngine } = await import('@mlc-ai/web-llm')
      const engine = new MLCEngine()
      engine.setInitProgressCallback((report) => {
        setInitProgressReport(report)
      })
      setEngine(engine)
    }
    init()
  }, [])

  return { engine, initProgressReport }
}
