"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconSend, IconX } from "@tabler/icons-react"

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch ticket data
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.id}`)
        if (response.ok) {
          const ticketData = await response.json()
          setTicket(ticketData)
        }
      } catch (error) {
        console.error('Error fetching ticket:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [params.id])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. An agent will respond shortly.",
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentMessage])
    }, 1000)
  }

  const handleCloseWindow = () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.closeCurrentWindow()
        .then((result: any) => {
          if (result.success) {
            console.log('Window closed successfully')
          } else {
            console.error('Failed to close window:', result.error)
            // Fallback to window.close()
            window.close()
          }
        })
        .catch((error: any) => {
          console.error('Error closing window:', error)
          // Fallback to window.close()
          window.close()
        })
    } else {
      window.close()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background w-full">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b border-border bg-muted/20 cursor-move"
        style={{ WebkitAppRegion: 'drag' }}
      >
                 <div className="flex items-center gap-2">
           <div className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">
             {ticket?.ticket_id || 'Loading...'}
           </div>
                                               <div className="min-w-0">
               <h1 className="text-base font-semibold truncate">
                 {ticket?.first_name && ticket?.last_name 
                   ? `${ticket.first_name} ${ticket.last_name}`
                   : ticket?.first_name || ticket?.last_name || 'Loading user details...'
                 }
               </h1>
             </div>
         </div>
                         <Button
          variant="ghost"
          size="sm"
          onClick={handleCloseWindow}
          className="h-6 w-6 p-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <IconX className="h-6 w-6" />
        </Button>
      </div>

             {/* Messages */}
       <div className="flex-1 overflow-y-auto p-3 space-y-2">
         {messages.length === 0 ? (
           <div className="text-center py-6 text-muted-foreground">
             <p className="text-sm">No messages yet. Start the conversation!</p>
           </div>
         ) : (
           messages.map((message) => (
             <div
               key={message.id}
               className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`flex items-end gap-1 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <Avatar className="h-6 w-6">
                   <AvatarImage src="" />
                   <AvatarFallback className="text-sm">
                     {message.sender === 'user' ? 'U' : 'A'}
                   </AvatarFallback>
                 </Avatar>
                 <div className={`rounded-lg px-3 py-2 text-sm ${
                   message.sender === 'user' 
                     ? 'bg-primary text-primary-foreground' 
                     : 'bg-muted text-foreground'
                 }`}>
                   {message.text}
                 </div>
               </div>
             </div>
           ))
         )}
       </div>

             {/* Message Input */}
       <div className="p-3 border-t border-border bg-muted/10">
         <div className="flex gap-2">
           <Input
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
             placeholder="Type your message..."
             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
             className="flex-1 h-10 text-sm"
           />
           <Button onClick={handleSendMessage} size="sm" className="h-10 w-10 p-0">
             <IconSend className="h-4 w-4" />
           </Button>
         </div>
       </div>
    </div>
  )
} 