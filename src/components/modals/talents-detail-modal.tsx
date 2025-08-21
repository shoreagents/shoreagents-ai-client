"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCalendar, IconClock, IconUser, IconBuilding, IconMapPin, IconFile, IconMessage, IconEdit, IconTrash, IconShare, IconCopy, IconDownload, IconEye, IconTag, IconPhone, IconMail, IconId, IconBriefcase, IconCalendarTime, IconCircle, IconAlertCircle, IconInfoCircle, IconStar, IconCurrencyPeso, IconMapPin as IconLocation, IconAward, IconCode, IconDots, IconRobot, IconSend, IconBrain, IconRefresh, IconSparkles, IconBulb } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { Tabs, TabsContent } from "@/components/ui/tabs"

interface TalentsDetailModalProps {
  talent: TalentProfile | null
  isOpen: boolean
  onClose: () => void
}

interface TalentProfile {
  id: string
  name: string
  avatar: string
  hourlyRate: number
  rating: number
  description: string
  skills: string[]
  originalSkillsData?: any
  position?: string
  shift?: string
  status?: string
  experience?: string
  education?: Education[]
  location?: string
  email?: string
  phone?: string
  portfolio?: string
  resumeSlug?: string
  availability?: string
  languages?: string[]
  certifications?: string[]
  projects?: Project[]
  comments?: Comment[]
}

interface Education {
  degree: string
  major?: string
  institution: string
  years: string
  location: string
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  duration: string
  url?: string
}

interface Comment {
  id: string
  comment: string
  created_at: string
  updated_at?: string
  user_id?: string
  user_name: string
  user_role: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    talentId?: string
    analysisType?: string
    confidence?: number
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "text-green-700 dark:text-white border-green-600/20 bg-green-50 dark:bg-green-600/20"
    case "Busy":
      return "text-orange-700 dark:text-white border-orange-600/20 bg-orange-50 dark:bg-orange-600/20"
    case "Unavailable":
      return "text-red-700 dark:text-white border-red-600/20 bg-red-50 dark:bg-red-600/20"
    case "Part-time":
      return "text-blue-700 dark:text-white border-blue-600/20 bg-blue-50 dark:bg-blue-600/20"
    default:
      return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Available":
      return <IconCircle className="h-4 w-4" />
    case "Busy":
      return <IconClock className="h-4 w-4" />
    case "Unavailable":
      return <IconAlertCircle className="h-4 w-4" />
    case "Part-time":
      return <IconCalendarTime className="h-4 w-4" />
    default:
      return <IconInfoCircle className="h-4 w-4" />
  }
}

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
    }),
    full: date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}

export function TalentsDetailModal({ talent, isOpen, onClose }: TalentsDetailModalProps) {
  const { theme } = useTheme()
  const [comment, setComment] = React.useState("")
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [commentsList, setCommentsList] = React.useState<Comment[]>(talent?.comments || [])
  const [hoveredComment, setHoveredComment] = React.useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [commentToDelete, setCommentToDelete] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("information")
  const [aiAnalysis, setAiAnalysis] = React.useState<any>(null)
  const [isLoadingAi, setIsLoadingAi] = React.useState(false)
  const [aiError, setAiError] = React.useState<string | null>(null)
  
  // Chatbot state
  const [activityTab, setActivityTab] = React.useState<'comments' | 'ai-chat'>('comments')
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = React.useState("")
  const [isLoadingChat, setIsLoadingChat] = React.useState(false)
  const [conversationStarters, setConversationStarters] = React.useState<string[]>([])
  const [isLoadingStarters, setIsLoadingStarters] = React.useState(false)

  React.useEffect(() => {
    // Reset comments on modal open or talent change
    setCommentsList(talent?.comments || [])
    // Reset AI analysis when talent changes
    setAiAnalysis(null)
    setAiError(null)
    // Reset active tab to default when talent changes
    setActiveTab("information")
    // Reset activity tab to default when talent changes
    setActivityTab('comments')
    // Reset chat state when talent changes
    setChatMessages([])
    setChatInput("")
    setConversationStarters([])
  }, [talent?.id, isOpen])

  React.useEffect(() => {
    // Fetch latest comments from API when opening the modal
    const fetchComments = async () => {
      if (!isOpen || !talent?.id) return
      try {
        const resp = await fetch(`/api/talent-pool/${talent.id}/comments`)
        if (!resp.ok) return
        const data = await resp.json()
        if (Array.isArray(data.comments)) {
          setCommentsList(data.comments)
        }
      } catch (_) {
        // ignore
      }
    }
    fetchComments()
  }, [isOpen, talent?.id])

  React.useEffect(() => {
    const fetchAi = async () => {
      if (!isOpen || !talent?.id) return
      if (activeTab !== 'ai-analysis') return
      setIsLoadingAi(true)
      setAiError(null)
      try {
        const resp = await fetch(`/api/talent-pool/${talent.id}/ai-analysis`)
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to fetch AI analysis')
        }
        const data = await resp.json()
        if (data?.hasAnalysis && data.analysis) {
          setAiAnalysis(data.analysis)
        } else {
          setAiAnalysis(null)
        }
      } catch (e: any) {
        setAiError(e?.message || 'Failed to load AI analysis')
      } finally {
        setIsLoadingAi(false)
      }
    }
    fetchAi()
  }, [isOpen, talent?.id, activeTab])

  // Load chatbot conversation history and starters
  React.useEffect(() => {
    const loadChatData = async () => {
      if (!isOpen || !talent?.id || activityTab !== 'ai-chat') return
      
      try {
        // Load conversation history
        const historyResp = await fetch(`/api/talent-pool/${talent.id}/chatbot`)
        if (historyResp.ok) {
          const historyData = await historyResp.json()
          if (historyData.success && historyData.conversationHistory) {
            setChatMessages(historyData.conversationHistory.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })))
          }
        }

        // Load conversation starters
        if (conversationStarters.length === 0) {
          setIsLoadingStarters(true)
          const startersResp = await fetch(`/api/talent-pool/${talent.id}/chatbot?action=starters`)
          if (startersResp.ok) {
            const startersData = await startersResp.json()
            if (startersData.success && startersData.starters) {
              setConversationStarters(startersData.starters)
            }
          }
          setIsLoadingStarters(false)
        }
      } catch (error) {
        console.error('Error loading chat data:', error)
        setIsLoadingStarters(false)
      }
    }

    loadChatData()
  }, [isOpen, talent?.id, activityTab, conversationStarters.length])

  if (!talent) return null

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !talent || isSubmittingComment) return
    
    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/talent-pool/${talent.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit comment')
      }

      const data = await response.json()
      console.log('Comment submitted successfully:', data.comment)
      
      // Add the new comment to the comments list
      setCommentsList((prev) => [data.comment, ...prev])
      
      setComment("")
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment. Please try again.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!talent) return
    setCommentToDelete(commentId)
    setShowDeleteModal(true)
  }

  const confirmDeleteComment = async () => {
    if (!talent || !commentToDelete) return
    setDeletingId(commentToDelete)
    try {
      const resp = await fetch(`/api/talent-pool/${talent.id}/comments?commentId=${commentToDelete}`, {
        method: 'DELETE'
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to delete comment')
      }
      setCommentsList((prev) => prev.filter(c => c.id !== commentToDelete))
      setShowDeleteModal(false)
      setCommentToDelete(null)
    } catch (e) {
      console.error('Delete comment failed:', e)
      alert('Failed to delete comment')
    } finally {
      setDeletingId(null)
    }
  }

  const cancelDeleteComment = () => {
    setShowDeleteModal(false)
    setCommentToDelete(null)
  }

  // Chatbot functions
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !talent || isLoadingChat) return
    
    setIsLoadingChat(true)
    try {
      const response = await fetch(`/api/talent-pool/${talent.id}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput.trim(),
          conversationHistory: chatMessages
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()
      if (data.success && data.conversationHistory) {
        setChatMessages(data.conversationHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      }
      
      setChatInput("")
    } catch (error) {
      console.error('Error sending chat message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsLoadingChat(false)
    }
  }

  const handleStarterClick = async (starter: string) => {
    setChatInput(starter)
  }

  const clearChatHistory = async () => {
    if (!talent) return
    
    try {
      const response = await fetch(`/api/talent-pool/${talent.id}/chatbot`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setChatMessages([])
      }
    } catch (error) {
      console.error('Error clearing chat history:', error)
    }
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose} key={talent?.id}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 rounded-xl" style={{ 
          backgroundColor: theme === 'dark' ? '#111111' : '#f8f9fa' 
        }}>
          <DialogHeader className="sr-only">
            <DialogTitle>Talent Profile: {talent.name}</DialogTitle>
            <DialogDescription>
              View detailed profile information and interact with {talent.name}'s talent profile
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-[95vh]">
            {/* Left Panel - Talent Details */}
            <div className="flex-1 flex flex-col">
                             {/* Top Navigation Bar */}
               <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b">
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                     <IconStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                     <span className="font-medium text-lg">{talent.rating}</span>
                     <span className="text-sm text-muted-foreground">Rating</span>
                   </div>
                 </div>

               </div>

              {/* Talent Header */}
              <div className="px-6 py-5">
                {/* Talent Title */}
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={talent.avatar} alt={talent.name} />
                    <AvatarFallback className="text-2xl">
                      {talent.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-semibold mb-2">{talent.name}</h1>
                    {talent.position && (
                      <div className="flex items-center gap-2 text-lg text-muted-foreground mb-2">
                        <IconBriefcase className="h-5 w-5" />
                        <span>{talent.position}</span>
                      </div>
                    )}
                    {talent.email && (
                      <div className="flex items-center gap-2 text-base text-muted-foreground">
                        <IconMail className="h-4 w-4" />
                        <span>{talent.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl flex items-center gap-1">
                      <span className="text-green-600 font-bold">₱</span>
                      <span className="font-bold">{talent.hourlyRate.toLocaleString()}</span>
                      <span className="text-muted-foreground text-base"> /month</span>
                    </div>
                  </div>
                </div>
                
                {/* Metadata Grid */}
                <div className="image 40% table 60%grid grid-cols-2 gap-4 text-sm">
                  {/* Shift */}
                  {talent.shift && (
                    <div className="flex items-center gap-2">
                      <IconClock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Shift:</span>
                      <span className="font-medium">{talent.shift}</span>
                    </div>
                  )}
                  
                  {/* Experience */}
                  {talent.experience && (
                    <div className="flex items-center gap-2">
                      <IconAward className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="font-medium">{talent.experience}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6">
                <Separator />
              </div>

                             {/* Talent Content - Tabbed View */}
               <div className="flex-1 flex flex-col px-6 py-5 min-h-0">
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
                                       <div className="mb-6 flex-shrink-0">
                                             <div className={`rounded-xl p-1 w-fit ${
                         theme === 'dark' 
                           ? 'bg-white/5 border border-white/10' 
                           : 'bg-gray-100/80 border border-gray-200'
                       }`}>
                                                 <AnimatedTabs
                           tabs={[
                             { title: "About", value: "information" },
                             { title: "AI Analysis", value: "ai-analysis" }
                           ]}
                           containerClassName="grid grid-cols-2 w-fit"
                           activeTabClassName={`rounded-xl ${
                             theme === 'dark' 
                               ? 'bg-zinc-800' 
                               : 'bg-[#ebebeb]'
                           }`}
                           onTabChange={(tab) => setActiveTab(tab.value)}
                         />
                      </div>
                    </div>

                   {/* Information Tab */}
                   <TabsContent value="information" className="space-y-6 overflow-y-auto flex-1 min-h-0">
                                           {/* Summary Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-muted-foreground">Summary</h3>
                        <div className="rounded-lg p-6 text-sm leading-relaxed min-h-[120px] border">
                          {talent.description || "No description provided."}
                        </div>
                      </div>

                                           {/* Skills and Resume Section - 2 Columns */}
                      <div className="grid grid-cols-2 gap-6 items-start">
                        {/* Skills Section */}
                        <div className="h-full">
                          <h3 className="text-lg font-medium mb-2 text-muted-foreground">Skills</h3>
                          <div className="rounded-lg p-6 min-h-[200px] border h-full flex flex-col">
                            <div className="space-y-4 flex-1">
                              {/* Dynamic Skills Categories */}
                              {(() => {
                                // Get the original skills data from the talent object
                                const originalSkillsData = (talent as any).originalSkillsData || talent.skills
                                
                                // If we have structured skills data, display by category
                                if (originalSkillsData && typeof originalSkillsData === 'object' && !Array.isArray(originalSkillsData)) {
                                  const categories = Object.keys(originalSkillsData)
                                  const validCategories = categories.filter(cat => 
                                    Array.isArray(originalSkillsData[cat]) && originalSkillsData[cat].length > 0
                                  )
                                  
                                  if (validCategories.length > 0) {
                                    return validCategories.map((category) => (
                                      <div key={category}>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                          {category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {originalSkillsData[category].map((skill: string, index: number) => (
                                            <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ))
                                  }
                                }
                                
                                // Fallback to flat skills array if no structured data
                                if (Array.isArray(talent.skills) && talent.skills.length > 0) {
                                  return (
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">All Skills</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {talent.skills.map((skill: string, index: number) => (
                                          <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                }
                                
                                // No skills fallback
                                return (
                                  <span className="text-sm text-muted-foreground">No skills listed</span>
                                )
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Resume Container */}
                        <div className="h-full">
                          <h3 className="text-lg font-medium mb-2 text-muted-foreground">Resume</h3>
                          <div className="rounded-lg p-6 min-h-[200px] border bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 cursor-pointer h-full flex flex-col"
                               onClick={() => talent.resumeSlug && window.open(`https://www.bpoc.io/${talent.resumeSlug}`, '_blank')}>
                            <div className="flex flex-col items-center justify-center flex-1 text-center">
                              <div className="mb-3">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mb-2">
                                  <IconFile className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                              </div>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                View Resume
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Click to open resume
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                     {/* Education Section */}
                     {talent.education && talent.education.length > 0 && (
                       <div>
                         <h3 className="text-lg font-medium mb-2 text-muted-foreground">Education</h3>
                         <div className="rounded-lg p-6 min-h-[120px] border">
                           <div className="space-y-2">
                             {talent.education.map((edu: Education, index: number) => (
                               <div key={index} className="flex items-start gap-2">
                                 <IconAward className="h-4 w-4 text-yellow-500" />
                                 <div className="flex-1">
                                   <p className="text-sm font-medium">{edu.degree}</p>
                                   <p className="text-xs text-muted-foreground">{edu.major}</p>
                                   <p className="text-xs text-muted-foreground">{edu.institution}</p>
                                   <p className="text-xs text-muted-foreground">{edu.years}</p>
                                   <p className="text-xs text-muted-foreground">{edu.location}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Languages Section */}
                     {talent.languages && talent.languages.length > 0 && (
                       <div>
                         <h3 className="text-lg font-medium mb-2 text-muted-foreground">Languages</h3>
                         <div className="rounded-lg p-6 min-h-[120px] border">
                           <div className="flex flex-wrap gap-2">
                             {talent.languages.map((language: string, index: number) => (
                               <Badge key={index} variant="outline" className="text-xs">
                                 {language}
                               </Badge>
                             ))}
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Certifications Section */}
                     {talent.certifications && talent.certifications.length > 0 && (
                       <div>
                         <h3 className="text-lg font-medium mb-2 text-muted-foreground">Certifications</h3>
                         <div className="rounded-lg p-6 min-h-[120px] border">
                           <div className="space-y-2">
                             {talent.certifications.map((cert: string, index: number) => (
                               <div key={index} className="flex items-center gap-2">
                                 <IconAward className="h-4 w-4 text-yellow-500" />
                                 <span className="text-sm">{cert}</span>
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Portfolio Section */}
                     {talent.portfolio && (
                       <div>
                         <h3 className="text-lg font-medium mb-2 text-muted-foreground">Portfolio</h3>
                         <div className="rounded-lg p-6 min-h-[120px] border">
                           <div className="flex items-center gap-2 mb-2">
                             <IconCode className="h-4 w-4 text-muted-foreground" />
                             <a 
                               href={talent.portfolio} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline"
                             >
                               {talent.portfolio}
                             </a>
                           </div>
                         </div>
                       </div>
                     )}
                   </TabsContent>

                   {/* AI Analysis Tab */}
                   <TabsContent value="ai-analysis" className="space-y-6 overflow-y-auto flex-1 min-h-0">
                     {isLoadingAi ? (
                       <div className="space-y-4">
                         <div className="h-8 w-56 bg-muted animate-pulse rounded" />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="h-24 bg-muted animate-pulse rounded" />
                           <div className="h-24 bg-muted animate-pulse rounded" />
                           <div className="h-24 bg-muted animate-pulse rounded" />
                         </div>
                         <div className="h-32 bg-muted animate-pulse rounded" />
                       </div>
                     ) : aiError ? (
                       <div className="text-center py-12">
                         <p className="text-sm text-red-500 mb-3">{aiError}</p>
                         <Button 
                           onClick={() => { setAiAnalysis(null); setAiError(null); setActiveTab('ai-analysis') }}
                           variant="secondary"
                           size="sm"
                         >
                           Retry
                         </Button>
                       </div>
                     ) : !aiAnalysis ? (
                       <div className="text-center py-12">
                         <div className="w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mx-auto mb-4">
                           <IconFile className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                         </div>
                         <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                         <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                           No AI analysis results were found for this talent.
                         </p>
                         {talent.resumeSlug && (
                           <Button 
                             onClick={() => window.open(`https://www.bpoc.io/${talent.resumeSlug}`, '_blank')}
                             className="bg-blue-600 hover:bg-blue-700"
                           >
                             <IconFile className="h-4 w-4 mr-2" />
                             Open Resume
                           </Button>
                         )}
                       </div>
                     ) : (
                       <div className="space-y-6">
                         {/* Key Strengths */}
                         {Array.isArray(aiAnalysis.keyStrengths) && aiAnalysis.keyStrengths.length > 0 && (
                           <div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {/* Key Strengths Card */}
                               {Array.isArray(aiAnalysis.keyStrengths) && aiAnalysis.keyStrengths.length > 0 && (
                                 <Card className="h-full">
                                   <CardHeader className="pb-2">
                                     <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                                       <span>🎯</span>
                                       Key Strengths
                                     </CardTitle>
                                   </CardHeader>
                                   <CardContent className="text-sm text-foreground/90">
                                     <ol className="list-decimal ml-4 space-y-1">
                                       {aiAnalysis.keyStrengths.map((strength: any, idx: number) => (
                                         <li key={idx}>
                                           {typeof strength === 'string' ? strength : strength?.title || strength?.name || 'Strength'}
                                         </li>
                                       ))}
                                     </ol>
                                   </CardContent>
                                 </Card>
                               )}
                               
                               {(() => {
                                 const strengths = aiAnalysis.strengthsAnalysis
                                 const categories = [
                                   { key: 'topStrengths', label: 'Top Strengths', icon: '⭐' },
                                   { key: 'coreStrengths', label: 'Core Strengths', icon: '💪' },
                                   { key: 'technicalStrengths', label: 'Technical Strengths', icon: '⚙️' },
                                   { key: 'achievements', label: 'Notable Achievements', icon: '🏆' },
                                   { key: 'marketAdvantage', label: 'Market Advantages', icon: '📈' },
                                   { key: 'uniqueValue', label: 'Unique Value Proposition', icon: '💎' },
                                   { key: 'areasToHighlight', label: 'Areas to Highlight', icon: '✨' }
                                 ]
                                 
                                 return categories.map(({ key, label, icon }) => {
                                   const data = strengths[key]
                                   if (!data) return null
                                   
                                   let displayValue = ''
                                   if (Array.isArray(data)) {
                                     displayValue = data.map((item: any) => 
                                       typeof item === 'string' ? item : item?.title || item?.name || item?.description || 'Item'
                                     ).join(', ')
                                   } else if (typeof data === 'string') {
                                     displayValue = data
                                   } else {
                                     return null
                                   }
                                   
                                   if (!displayValue.trim()) return null
                                   
                                   return (
                                     <Card key={key} className="h-full">
                                       <CardHeader className="pb-2">
                                         <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                                           <span>{icon}</span>
                                           {label}
                                         </CardTitle>
                                       </CardHeader>
                                       <CardContent className="text-sm text-foreground/90">
                                         {Array.isArray(data) ? (
                                           <ol className="list-decimal ml-4 space-y-1">
                                             {data.map((item: any, idx: number) => (
                                               <li key={idx}>
                                                 {typeof item === 'string' ? item : item?.title || item?.name || item?.description || 'Item'}
                                               </li>
                                             ))}
                                           </ol>
                                         ) : typeof data === 'string' ? (
                                           <ol className="list-decimal ml-4 space-y-1">
                                             <li>{data}</li>
                                           </ol>
                                         ) : (
                                           <ol className="list-decimal ml-4 space-y-1">
                                             <li>{JSON.stringify(data)}</li>
                                           </ol>
                                         )}
                                       </CardContent>
                                     </Card>
                                   )
                                 }).filter(Boolean)
                               })()}
                             </div>
                           </div>
                         )}
                       </div>
                     )}
                   </TabsContent>
                 </Tabs>
               </div>
            </div>

                        {/* Right Panel - Activity & Comments */}
            <div className="w-96 flex flex-col border-l h-full">
              {/* Activity Header with Tabs */}
              <div className="bg-sidebar border-b flex-shrink-0">
                <div className="px-6 py-4">
                  <h3 className="font-medium mb-3">Activity</h3>
                  <div className="flex gap-1 bg-background rounded-lg p-1">
                    <button
                      onClick={() => setActivityTab('comments')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activityTab === 'comments'
                          ? 'bg-sidebar text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconMessage className="h-4 w-4" />
                      Comments
                    </button>
                    <button
                      onClick={() => setActivityTab('ai-chat')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activityTab === 'ai-chat'
                          ? 'bg-sidebar text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconRobot className="h-4 w-4" />
                      AI Assistant
                    </button>
                  </div>
                </div>
              </div>

                            {/* Activity Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 bg-[#ebebeb] dark:bg-[#0a0a0a]">
                
                {/* Comments Tab */}
                {activityTab === 'comments' && (
                  <div className="space-y-4">
                    {commentsList && commentsList.length > 0 ? (
                      commentsList.map((comment) => {
                        const commentDate = formatDate(comment.created_at)
                        
                        return (
                          <motion.div 
                            key={comment.id} 
                            className="rounded-lg p-4 bg-sidebar border"
                            onHoverStart={() => setHoveredComment(comment.id)}
                            onHoverEnd={() => setHoveredComment(null)}
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
                                   {hoveredComment !== comment.id ? (
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
                                        key="clock-icon"
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
                                        
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <div 
                                                 className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                                 onClick={() => handleDeleteComment(comment.id)}
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
                     })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <IconMessage className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No comments yet</p>
                        <p className="text-xs">Be the first to add a comment!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Chat Tab */}
                {activityTab === 'ai-chat' && (
                  <div className="space-y-4">
                    {/* Chat Header with Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconBrain className="h-4 w-4" />
                        <span>AI Talent Analysis Assistant</span>
                      </div>
                      {chatMessages.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearChatHistory}
                                className="h-8 w-8 p-0"
                              >
                                <IconRefresh className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Clear conversation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-4">
                      {chatMessages.length > 0 ? (
                        chatMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-lg p-4 ${
                              message.role === 'user'
                                ? 'bg-blue-500/10 border border-blue-500/20 ml-8'
                                : 'bg-sidebar border'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                {message.role === 'user' ? (
                                  <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
                                ) : (
                                  <AvatarFallback className="bg-purple-500 text-white">
                                    <IconRobot className="h-4 w-4" />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium">
                                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                  {message.content}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                            <IconSparkles className="h-8 w-8 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">AI Talent Assistant</h3>
                          <p className="text-muted-foreground mb-6 text-sm">
                            Ask me anything about {talent.name}'s profile, skills, or potential fit for roles.
                          </p>
                          
                          {/* Conversation Starters */}
                          {!isLoadingStarters && conversationStarters.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-1">
                                <IconBulb className="h-3 w-3" />
                                Try asking:
                              </p>
                              {conversationStarters.slice(0, 3).map((starter, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-auto py-2 px-3 text-left whitespace-normal w-full"
                                  onClick={() => handleStarterClick(starter)}
                                >
                                  {starter}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          {isLoadingStarters && (
                            <div className="space-y-2">
                              <div className="h-8 bg-muted animate-pulse rounded" />
                              <div className="h-8 bg-muted animate-pulse rounded" />
                              <div className="h-8 bg-muted animate-pulse rounded" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Section */}
              <div className="px-3 pb-3 bg-[#ebebeb] dark:bg-[#0a0a0a]">
                <div className="flex gap-3 bg-sidebar rounded-lg p-4 border">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="" alt="Current User" />
                    <AvatarFallback className="text-xs">
                      {activityTab === 'ai-chat' ? <IconRobot className="h-4 w-4" /> : 'CU'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {activityTab === 'comments' ? (
                      <form onSubmit={handleCommentSubmit}>
                        <Input 
                          placeholder="Write a comment..." 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="text-sm"
                          disabled={isSubmittingComment}
                        />
                      </form>
                    ) : (
                      <form onSubmit={handleChatSubmit}>
                        <Input 
                          placeholder="Ask about this talent's skills, experience, or potential fit..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="text-sm"
                          disabled={isLoadingChat}
                        />
                      </form>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="rounded-lg" 
                    onClick={activityTab === 'comments' ? handleCommentSubmit : handleChatSubmit}
                    disabled={
                      activityTab === 'comments' 
                        ? (!comment.trim() || isSubmittingComment)
                        : (!chatInput.trim() || isLoadingChat)
                    }
                  >
                    {activityTab === 'comments' ? (
                      isSubmittingComment ? (
                        <>
                          <IconClock className="h-4 w-4 mr-1 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <IconSend className="h-4 w-4 mr-1" />
                          Send
                        </>
                      )
                    ) : (
                      isLoadingChat ? (
                        <>
                          <IconClock className="h-4 w-4 mr-1 animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        <>
                          <IconSend className="h-4 w-4 mr-1" />
                          Ask AI
                        </>
                      )
                    )}
                  </Button>
                </div>
              </div>
            </div>
                     </div>
         </DialogContent>
       </Dialog>

               {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-sm" hideClose>
            <DialogHeader>
              <DialogTitle>
                Delete Comment
              </DialogTitle>
            </DialogHeader>
                       <div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
            </div>
           <div className="flex justify-end gap-3">
                           <Button 
                variant="ghost" 
                onClick={cancelDeleteComment}
                disabled={deletingId !== null}
              >
                Cancel
              </Button>
             <Button 
               variant="destructive" 
               onClick={confirmDeleteComment}
               disabled={deletingId !== null}
               className="bg-red-600 hover:bg-red-700"
             >
               {deletingId !== null ? 'Deleting...' : 'Delete'}
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     </TooltipProvider>
   )
 }
