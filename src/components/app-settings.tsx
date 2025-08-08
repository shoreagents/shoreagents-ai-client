"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function AppSettingsPopover({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
                  <PopoverContent className="w-48 bg-background text-foreground border border-border rounded-[10px] p-1 shadow-sm dark:shadow-none dark:border-white/10" align="start" side="bottom" sideOffset={5}>
        <div className="space-y-1">
          <div className="px-2 py-1.5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground">Theme</label>
                <p className="text-xs text-muted-foreground">
                  Light or Dark Mode
                </p>
              </div>
              <div className="relative flex items-center">
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className={`relative inline-flex h-6 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
                    theme === 'dark' ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <motion.div
                    className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center"
                    animate={{
                      x: theme === 'dark' ? 20 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {theme === 'light' ? (
                        <motion.div
                          key="sun"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SunIcon className="h-3 w-3 text-gray-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MoonIcon className="h-3 w-3 text-teal-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 