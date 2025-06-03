import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm'

let handler: WebWorkerMLCEngineHandler | null = null

self.onmessage = (msg: MessageEvent) => {
  if (!handler) {
    handler = new WebWorkerMLCEngineHandler()
  }
  handler.onmessage(msg)
}
