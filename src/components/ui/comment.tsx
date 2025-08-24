"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconClock, IconTrash } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

export interface CommentData {
  id: string
  comment: string
  created_at: string
  updated_at?: string
  user_id?: string
  user_name: string
  user_role?: string
}

interface CommentProps {
  comment: CommentData
  onDelete?: (commentId: string) => void
  showDeleteButton?: boolean
  className?: string
}

export function Comment({ comment, onDelete, showDeleteButton = false, className = "" }: CommentProps) {
  const [hovered, setHovered] = React.useState(false)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const commentDate = formatDate(comment.created_at)

  return (
    <motion.div 
      className={`rounded-lg p-4 bg-sidebar border ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>{comment.user_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{comment.user_name}</span>
        </div>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            {!hovered ? (
              <motion.div 
                key="date-time"
                className="flex items-center gap-2 text-xs text-muted-foreground"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <span>{commentDate.date}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-current opacity-60" />
                <span>{commentDate.time}</span>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-2">
                      <div className="text-center">
                        <p className="text-xs font-medium">{commentDate.date}</p>
                        <p className="text-xs text-muted-foreground">{commentDate.time}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {showDeleteButton && onDelete && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => onDelete(comment.id)}
                        >
                          <IconTrash className="h-4 w-4 text-red-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="p-2">
                        <div className="text-center">
                          <p className="text-sm font-medium text-red-400">Delete</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="text-sm text-foreground leading-relaxed">
        {comment.comment}
      </div>
    </motion.div>
  )
}
