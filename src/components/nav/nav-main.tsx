"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRef } from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | any
    disabled?: boolean
  }[]
}) {
  const pathname = usePathname()
  
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname === item.url + "/" || (item.url === "/" && (pathname === "/" || pathname === "//"))
            const iconRef = useRef<any>(null)
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild={!item.disabled}
                  tooltip={item.title}
                  disabled={item.disabled}
                  className={`${isActive ? "bg-gray-200 dark:bg-teal-600/30 focus:bg-gray-200 dark:focus:bg-teal-600/30 active:bg-gray-200 dark:active:bg-teal-600/30 text-sidebar-accent-foreground dark:text-white hover:!bg-gray-200 dark:hover:!bg-teal-600/30" : "text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"} ${item.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center`}
                  onMouseEnter={() => !item.disabled && iconRef.current?.startAnimation?.()}
                  onMouseLeave={() => !item.disabled && iconRef.current?.stopAnimation?.()}
                >
                  {item.disabled ? (
                    <div className="flex items-center justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:gap-0">
                      {item.icon && <item.icon ref={iconRef} className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />}
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </div>
                  ) : (
                    <a href={item.url} className="flex items-center justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:gap-0">
                      {item.icon && <item.icon ref={iconRef} className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />}
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </a>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
