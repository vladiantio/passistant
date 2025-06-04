import { Textarea } from "@/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip"
import { cn } from "@/lib/utils"
import React, {
  createContext,
  useContext,
  useState,
} from "react"
import { Button } from "./button"

type PromptInputContextType = {
  isLoading: boolean
  value: string
  setValue: (value: string) => void
  maxHeight: number | string
  onSubmit?: () => void
  disabled?: boolean
}

const PromptInputContext = createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
})

function usePromptInput() {
  const context = useContext(PromptInputContext)
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput")
  }
  return context
}

type PromptInputProps = {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "")

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled,
        }}
      >
        <div
          className={cn(
            "border-input bg-background dark:bg-input/40 rounded-3xl border dark:border-0 p-3 shadow-xs relative",
            className
          )}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  )
}

export type PromptInputTextareaProps = {
  disableAutosize?: boolean
} & React.ComponentProps<typeof Textarea>

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled) onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "p-1 min-h-9 w-full resize-none border-none dark:bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 z-[2]",
        !disableAutosize && "field-sizing-content",
        className
      )}
      style={{
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
      }}
      {...props}
    />
  )
}

type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>

function PromptInputActions({
  children,
  className,
  ...props
}: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 pt-2 [&>*]:z-[1]", className)} {...props}>
      {children}
    </div>
  )
}

type PromptInputActionProps = {
  className?: string
  arrowClassName?: string
  disabled?: boolean
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
} & React.ComponentProps<typeof Tooltip>

function PromptInputAction({
  tooltip,
  children,
  className,
  arrowClassName,
  disabled: disabledProp,
  side = "top",
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput()

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabledProp ?? disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        className={className}
        arrowClassName={arrowClassName}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

type PromptInputSubmitButtonProps =
  Omit<React.ComponentProps<typeof Button>, "disabled" | "type">

function PromptInputSubmitButton({
  onClick,
  ...props
}: PromptInputSubmitButtonProps) {
  const { disabled, onSubmit } = usePromptInput()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSubmit?.()
    onClick?.(e)
  }

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      {...props}
    />
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
  PromptInputSubmitButton,
}
