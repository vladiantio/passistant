import { useEffect, useState } from "react"
import { prebuiltAppConfig } from "@mlc-ai/web-llm"

export function useAvailableModels() {
  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    const modelList = prebuiltAppConfig.model_list.map((m) => m.model_id)
    setModels(modelList)
  }, [])

  return models
}