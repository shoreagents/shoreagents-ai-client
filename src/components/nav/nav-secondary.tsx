"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AppSettingsPopover } from "@/components/app-settings"

export function NavSecondary({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
  className?: string
}) {
  const pathname = usePathname()
  
  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname === item.url + "/"
            
            // Special handling for Settings
            if (item.title === "Settings") {
              return (
                <SidebarMenuItem key={item.title}>
                  <AppSettingsPopover>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={`${isActive ? "bg-gray-200 dark:bg-teal-600/30 focus:bg-gray-200 dark:focus:bg-teal-600/30 active:bg-gray-200 dark:active:bg-teal-600/30 text-sidebar-accent-foreground dark:text-white hover:!bg-gray-200 dark:hover:!bg-teal-600/30" : "text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"} group-data-[collapsible=icon]:hover:bg-sidebar-accent dark:group-data-[collapsible=icon]:hover:bg-sidebar-accent group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center`}
                    >
                      <div className="flex items-center justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:gap-0">
                        {item.icon && <item.icon className="h-4 w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />}
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </AppSettingsPopover>
                </SidebarMenuItem>
              )
            }
            
            // Default handling for other items
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  className={`${isActive ? "bg-gray-200 dark:bg-teal-600/30 focus:bg-gray-200 dark:focus:bg-teal-600/30 active:bg-gray-200 dark:active:bg-teal-600/30 text-sidebar-accent-foreground dark:text-white hover:!bg-gray-200 dark:hover:!bg-teal-600/30" : "text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"} group-data-[collapsible=icon]:hover:bg-sidebar-accent dark:group-data-[collapsible=icon]:hover:bg-sidebar-accent group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center`}
                >
                  <a href={item.url} className="flex items-center justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:gap-0">
                    {item.icon && <item.icon className="h-4 w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
