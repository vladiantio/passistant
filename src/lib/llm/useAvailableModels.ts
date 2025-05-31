import { useEffect, useState } from "react"

export function useAvailableModels() {
  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      const { prebuiltAppConfig } = await import('@mlc-ai/web-llm')
      const modelList = prebuiltAppConfig.model_list.map((m) => m.model_id)
      setModels(modelList)
    }
    init()
  }, [])

  return models
}