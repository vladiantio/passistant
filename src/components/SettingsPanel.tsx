import { BrainCog, Settings2, StarIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { t } from '@lingui/core/macro'

interface SettingsPanelProps {
  selectedModel: string
  availableModels: string[]
  onModelChange: (model: string) => void
  enableThinking: boolean
  onEnableThinkingChange: (enabled: boolean) => void
  showSettings: boolean
  onShowSettingsChange: (show: boolean) => void
}

export function SettingsPanel({
  selectedModel,
  availableModels,
  onModelChange,
  enableThinking,
  onEnableThinkingChange,
  showSettings,
  onShowSettingsChange,
}: SettingsPanelProps) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onEnableThinkingChange(!enableThinking)}
        className={cn(
          "rounded-full transition-all flex items-center gap-2 px-3 py-2 h-9",
          enableThinking
            ? "bg-secondary/15 text-secondary hover:bg-secondary/20"
            : "text-muted-foreground hover:bg-muted-foreground/15"
        )}
      >
        <BrainCog className="size-4" />
        {t`feature.reasoning`}
      </button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", showSettings && "!text-secondary")}
        onClick={() => onShowSettingsChange(!showSettings)}
      >
        <Settings2 className="size-4" />
      </Button>
      {showSettings && (
        <Select 
          value={selectedModel} 
          onValueChange={onModelChange}
        >
          <SelectTrigger className="border-0 dark:bg-transparent shadow-none rounded-full">
            <SelectValue placeholder={t`placeholder.model`} />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        asChild
      >
        <a href="https://github.com/vladiantio/passistant" target="_blank" rel="noopener noreferrer">
          <StarIcon className="size-4" />
        </a>
      </Button>
    </div>
  )
}
