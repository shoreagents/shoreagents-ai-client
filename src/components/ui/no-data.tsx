import React from "react"

interface NoDataProps {
  message?: string
  className?: string
}

export function NoData({ 
  message = "No Data Available",
  className = ""
}: NoDataProps) {
  return (
    <div className={`text-center py-12 px-6 text-muted-foreground border-2 border-dashed border-muted-foreground/30 rounded-xl bg-muted/20 ${className}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
