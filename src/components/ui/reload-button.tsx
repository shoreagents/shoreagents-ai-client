import * as React from "react"
import { IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ReloadButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  onReload: () => void
  children?: React.ReactNode
}

const ReloadButton = React.forwardRef<HTMLButtonElement, ReloadButtonProps>(
  ({ className, loading = false, onReload, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "text-sm h-9 rounded-lg shadow-none",
          className
        )}
        onClick={onReload}
        disabled={loading}
        {...props}
      >
        <IconRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {children || "Reload"}
      </Button>
    )
  }
)
ReloadButton.displayName = "ReloadButton"

export { ReloadButton } 