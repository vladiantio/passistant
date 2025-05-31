import { useEffect, useState } from 'react'
import { MLCEngine, type InitProgressReport } from '@mlc-ai/web-llm'

export function useMLCEngine() {
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
