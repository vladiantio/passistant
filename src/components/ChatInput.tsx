import { ArrowUp, Square } from 'lucide-react'
import { t } from '@lingui/core/macro'
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputSubmitButton,
  PromptInputTextarea,
} from '../ui/prompt-input'

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isTyping: boolean
  disabled: boolean
  children: React.ReactNode
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isTyping,
  disabled,
  children,
}: ChatInputProps) {
  return (
    <PromptInput
      className="max-w-[800px] w-full mx-auto"
      value={input}
      onValueChange={onInputChange}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      <PromptInputTextarea
        autoFocus
        placeholder={t`ui.prompt.placeholder`}
      />
      <PromptInputActions className="justify-between">
        {children}
        <PromptInputAction
          tooltip={isTyping ? t`button.stop` : t`button.send`}
        >
          <PromptInputSubmitButton
            variant="default"
            size="icon"
            className="rounded-full"
          >
            {isTyping ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </PromptInputSubmitButton>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  )
}
