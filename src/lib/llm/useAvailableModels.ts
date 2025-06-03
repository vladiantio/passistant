import { useEffect, useState } from "react"

export function useAvailableModels() {
  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      const { prebuiltAppConfig } = await import('@mlc-ai/web-llm')
      const modelList = prebuiltAppConfig.model_list
        .toSorted((a, b) => (a.vram_required_MB ?? 0) - (b.vram_required_MB ?? 0))
        .map((m) => m.model_id)
      setModels(modelList)
    }
    init()
  }, [])

  return models
}