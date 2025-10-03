import * as React from "react"
import { Input } from "@/components/ui/input"
import { IconX, IconCopy } from "@tabler/icons-react"

interface EditableFieldProps {
  fieldName: string
  value: string
  placeholder?: string
  onSave: (fieldName: string, value: string) => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  className?: string
}

export const EditableField = ({ 
  fieldName, 
  value, 
  placeholder = "-",
  onSave,
  onBlur,
  onKeyDown,
  className = "h-[33px] w-full text-sm border-0 bg-transparent dark:bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none shadow-none"
}: EditableFieldProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <Input
      value={value}
      onChange={(e) => onSave(fieldName, e.target.value)}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.();
      }}
      onFocus={() => setIsFocused(true)}
      onKeyDown={onKeyDown}
      className={className}
      placeholder={!isFocused && !value ? placeholder : ""}
    />
  );
}

interface DataFieldRowProps {
  icon: React.ReactNode
  label: React.ReactNode
  fieldName: string
  value: string | number | boolean | null | undefined
  placeholder?: string
  onSave?: (fieldName: string, value: string) => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  isLast?: boolean
  customInput?: React.ReactNode  // New prop for custom input components
  readOnly?: boolean  // New prop to make field read-only
}

export const DataFieldRow = ({
  icon,
  label,
  fieldName,
  value,
  placeholder = "-",
  onSave,
  onBlur,
  onKeyDown,
  isLast = false,
  customInput,
  readOnly = false
}: DataFieldRowProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div className={`grid grid-cols-[180px_auto_1fr] h-[33px] items-center overflow-hidden ${
      isLast ? '' : 'border-b border-[#cecece99] dark:border-border'
    }`}>
      <div className="flex items-center gap-3 min-w-0 px-4">
        {icon}
        <span className="text-sm text-foreground truncate">{label}</span>
      </div>
      <div className="w-px bg-[#cecece99] dark:bg-border h-full"></div>
      <div 
        className={`min-w-0 flex items-center relative transition-colors duration-200 pl-2 pr-2 h-full ${
          (isActive || isHovered) 
            ? 'bg-[#ebebeb] dark:bg-[#0a0a0a]' 
            : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      >
        {customInput ? (
          customInput
        ) : readOnly ? (
          <div className="flex items-center justify-between w-full">
            <span className={`text-sm ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
              {value || placeholder}
            </span>
            {value && typeof value === 'string' && value.trim() !== '' && (
              <div className={`flex items-center gap-2 transition-all duration-200 ease-in-out ${
                isHovered 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-2 pointer-events-none'
              }`}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigator.clipboard.writeText(value)
                  }}
                  className="p-0 hover:text-foreground rounded transition-colors text-muted-foreground"
                  title="Copy value"
                  tabIndex={-1}
                >
                  <IconCopy className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <EditableField 
              fieldName={fieldName}
              value={typeof value === 'string' ? value : String(value || '')}
              placeholder={placeholder}
              onSave={onSave || (() => {})}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
            />
            {value && typeof value === 'string' && value.trim() !== '' && (
              <div className={`flex items-center gap-2 transition-all duration-200 ease-in-out ${
                isHovered 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-2 pointer-events-none'
              }`}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigator.clipboard.writeText(value)
                  }}
                  className="p-0 hover:text-foreground rounded transition-colors text-muted-foreground"
                  title="Copy value"
                  tabIndex={-1}
                >
                  <IconCopy className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSave?.(fieldName, '')
                  }}
                  className="p-0 hover:text-foreground rounded transition-colors text-muted-foreground"
                  title="Clear value"
                  tabIndex={-1}
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
