import { Button } from "@/ui/button"
import { MessageLoading } from "@/ui/message";
import { copyToClipboard } from "@/utils/clipboard";
import { Check, Copy } from "lucide-react"
import { useState } from "react";
import { t } from "@lingui/core/macro"
import { ShiningText } from "@/ui/shining-text";

export function LoadingBlock() {
  return (
    <MessageLoading />
  )
}

type ThinkBlockProps = React.PropsWithChildren & {
  isThinking?: boolean
}

export function ThinkBlock(props: ThinkBlockProps) {
  if (!props.children || props.children?.toString().trim() === '') return null
  return (
    <details className="mb-6">
      <summary className="select-none">
        {props.isThinking ? (
          <ShiningText>{t`loading.thinking`}</ShiningText>
        ) : (
          t`feature.reasoning`
        )}
      </summary>
      <blockquote>
        {props.children}
      </blockquote>
    </details>
  )
}

export function PasswordBlock(props: React.PropsWithChildren) {
  const [copied, setCopied] = useState(false);

  const doCopyToClipboard = async () => {
    if (!props.children) return
    const success = await copyToClipboard(props.children?.toString());
    setCopied(success);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="bg-input/40 pl-2 pr-0.5 py-0.5 text-sm rounded-md inline-flex items-center gap-2 font-mono">
      {props.children ? (
        <>
          <span>{props.children}</span>
          <Button
            variant="outline"
            size="icon"
            className="relative size-5 border-0"
            onClick={doCopyToClipboard}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
            <Copy
              className={`size-3 transition-all ${
                copied ? "scale-0" : "scale-100"
              }`}
            />
            <Check
              className={`absolute inset-0 m-auto size-3 transition-all ${
                copied ? "scale-100" : "scale-0"
              }`}
            />
          </Button>
        </>
      ) : (
        <span className="mr-2">&lt;pass&gt;</span>
      )}
    </span>
  )
}
