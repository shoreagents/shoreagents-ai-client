import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-lg [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-teal-600 text-white shadow-sm border border-teal-600 hover:bg-teal-700 hover:border-teal-700",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border border-destructive hover:bg-destructive/90 hover:border-destructive/90",
        outline:
          "border border-teal-600 bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:border-teal-700 transition-all duration-200 transform-gpu",
        secondary:
          "bg-teal-600 text-white shadow-sm border border-teal-600 hover:bg-teal-700 hover:border-teal-700",
        soft:
          "bg-[hsl(var(--accent-foreground)/0.16)] text-foreground shadow-sm border border-[hsl(var(--accent-foreground)/0.16)] hover:bg-[hsl(var(--accent-foreground)/0.28)] hover:border-[hsl(var(--accent-foreground)/0.28)] dark:hover:bg-[hsl(var(--accent-foreground)/0.1)] dark:hover:border-[hsl(var(--accent-foreground)/0.1)]",
        ghost: "bg-gray-100 text-gray-700 border border-gray-100 hover:bg-gray-200 hover:border-gray-200 dark:bg-[#1e1e1e] dark:text-gray-200 dark:border-[#1e1e1e] dark:hover:bg-[#2a2a2a] dark:hover:border-[#2a2a2a]",
        muted: "bg-[#f4f4f4] dark:bg-[#363636] text-gray-700 dark:text-white border border-[#cecece99] dark:border-[#4f4f4f99] hover:bg-[#e8e8e8] dark:hover:bg-[#404040] hover:border-[#cecece99] dark:hover:border-[#4f4f4f99] shadow-none",
        link: "text-primary underline-offset-4 hover:underline border border-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
