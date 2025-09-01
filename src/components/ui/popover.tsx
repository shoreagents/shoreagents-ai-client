"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "popover-surface z-50 w-72 rounded-[10px] border border-sidebar-border dark:border-white/10 bg-sidebar dark:bg-[rgb(20_20_20)] p-1 text-sidebar-foreground shadow-sm dark:shadow-none outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {props.children}
      </div>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))

// Updated component with variants for different color schemes
interface PopoverItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean
  variant?: 'default' | 'primary'
  children: React.ReactNode
}

const PopoverItem = React.forwardRef<HTMLDivElement, PopoverItemProps>(
  ({ className, isSelected = false, variant = 'default', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg py-1.5 pl-2 pr-8 text-sm outline-none transition-colors",
        variant === 'default' && isSelected
          ? "bg-teal-600/50 text-foreground dark:bg-teal-600/30 dark:text-white"
          : variant === 'primary' && isSelected
          ? "bg-[hsl(0deg_0%_56.25%_/_20%)] text-primary dark:bg-[hsl(0deg_0%_38.16%_/_30%)] dark:text-primary"
          : variant === 'default'
          ? "text-sidebar-foreground hover:!bg-primary/5 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground active:bg-primary/10 dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:active:bg-primary/20"
          : "text-sidebar-foreground hover:!bg-primary/5 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground active:bg-primary/10 dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:active:bg-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
PopoverItem.displayName = "PopoverItem"

PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverItem }
