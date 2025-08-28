"use client"

import { cn } from "@/lib/utils"

interface AnimatedGradientIconProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientIcon({
  children,
  className,
}: AnimatedGradientIconProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 animate-gradient rounded-full bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] opacity-20"
        style={{
          filter: 'blur(2px)',
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
