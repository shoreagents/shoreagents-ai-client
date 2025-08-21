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
}: EditableFieldProps) => (
  <Input
    value={value}
    onChange={(e) => onSave(fieldName, e.target.value)}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    className={className}
    placeholder={placeholder}
  />
)

interface DataFieldRowProps {
  icon: React.ReactNode
  label: string
  fieldName: string
  value: string
  placeholder?: string
  onSave: (fieldName: string, value: string) => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  isLast?: boolean
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
  isLast = false
}: DataFieldRowProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className={`grid grid-cols-[140px_auto_1fr] gap-2 h-[33px] items-center ${isLast ? '' : 'border-b border-[#cecece99] dark:border-border'}`}>
      <div className="flex items-center gap-3 min-w-0 px-2">
        {icon}
        <span className="text-sm text-foreground truncate">{label}</span>
      </div>
      <div className="w-px bg-[#cecece99] dark:bg-border h-full"></div>
      <div 
        className="min-w-0 flex items-center relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <EditableField 
          fieldName={fieldName}
          value={value}
          placeholder={placeholder}
          onSave={onSave}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
                {value && value.trim() !== '' && (
          <div className={`absolute right-2 flex items-center gap-2 transition-all duration-200 ease-in-out ${
            isHovered 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-2 pointer-events-none'
          }`}>
            <button
              onClick={() => navigator.clipboard.writeText(value)}
              className="p-0 hover:text-foreground rounded transition-colors text-muted-foreground"
              title="Copy value"
              tabIndex={-1}
            >
              <IconCopy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSave(fieldName, '')}
              className="p-0 hover:text-foreground rounded transition-colors text-muted-foreground"
              title="Clear value"
              tabIndex={-1}
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
