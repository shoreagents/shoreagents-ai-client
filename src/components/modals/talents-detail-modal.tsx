"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCalendar, IconClock, IconUser, IconBuilding, IconMapPin, IconFile, IconMessage, IconEdit, IconTrash, IconShare, IconCopy, IconDownload, IconEye, IconTag, IconPhone, IconMail, IconId, IconBriefcase, IconCalendarTime, IconCircle, IconAlertCircle, IconInfoCircle, IconStar, IconCurrencyPeso, IconMapPin as IconLocation, IconAward, IconCode, IconDots } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

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

  React.useEffect(() => {
    // Reset comments on modal open or talent change
    setCommentsList(talent?.comments || [])
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
    if (!confirm('Delete this comment?')) return
    setDeletingId(commentId)
    try {
      const resp = await fetch(`/api/talent-pool/${talent.id}/comments?commentId=${commentId}`, {
        method: 'DELETE'
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to delete comment')
      }
      setCommentsList((prev) => prev.filter(c => c.id !== commentId))
    } catch (e) {
      console.error('Delete comment failed:', e)
      alert('Failed to delete comment')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 rounded-xl" style={{ 
          backgroundColor: theme === 'dark' ? '#111111' : '#f8f9fa' 
        }}>
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
                <div className="grid grid-cols-2 gap-4 text-sm">
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

              {/* Talent Content */}
              <div className="flex-1 px-6 py-5 overflow-y-auto">
                <div className="space-y-6">
                  {/* About Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-muted-foreground">About</h3>
                    <div className="rounded-lg p-6 text-sm leading-relaxed min-h-[120px] border">
                      {talent.description || "No description provided."}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-muted-foreground">Skills</h3>
                    <div className="rounded-lg p-6 min-h-[120px] border">
                      <div className="flex flex-wrap gap-2">
                        {talent.skills.map((skill: string, index: number) => (
                          <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Education and Resume Section - 2 Columns */}
                  <div className="grid grid-cols-2 gap-6 items-start">
                    {/* Education Section */}
                    {talent.education && talent.education.length > 0 && (
                      <div className="h-full">
                        <h3 className="text-lg font-medium mb-2 text-muted-foreground">Education</h3>
                        <div className="rounded-lg p-6 min-h-[200px] border h-full flex flex-col">
                          <div className="space-y-2 flex-1">
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

                    {/* Resume & AI Analysis Section */}
                    <div className="h-full">
                      <h3 className="text-lg font-medium mb-2 text-muted-foreground">Resume & AI Analysis</h3>
                      <div className="rounded-lg p-6 min-h-[200px] border bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 cursor-pointer h-full flex flex-col"
                           onClick={() => talent.resumeSlug && window.open(`https://www.bpoc.io/${talent.resumeSlug}`, '_blank')}>
                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                          <div className="mb-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mb-2">
                              <IconFile className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <p className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                            View Detailed Analysis
                          </p>
                          <p className="text-sm text-muted-foreground">
                            AI-powered resume insights
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

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
                </div>
              </div>
            </div>

            {/* Right Panel - Activity & Comments */}
            <div className="w-96 flex flex-col border-l h-full">
                             {/* Activity Header */}
               <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b flex-shrink-0">
                 <h3 className="font-medium">Activity</h3>
               </div>

              {/* Activity Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 bg-[#ebebeb] dark:bg-[#0a0a0a]">
                <div className="space-y-4">
                  {commentsList && commentsList.length > 0 ? (
                    commentsList.map((comment) => {
                      const commentDate = formatDate(comment.created_at)
                      
                      return (
                        <div key={comment.id} className="group rounded-lg p-4 bg-sidebar border">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback>{comment.user_name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{comment.user_name}</span>
                            </div>
                            <div className="relative flex items-center gap-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground transition-all duration-200 group-hover:opacity-0 group-hover:scale-95 data-[state=open]:opacity-0 data-[state=open]:scale-95">
                                <span>{commentDate.date}</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-current opacity-60" />
                                <span>{commentDate.time}</span>
                              </div>
                              {comment.user_id && (
                                <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 data-[state=open]:opacity-100 data-[state=open]:translate-x-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-150">
                                        <IconDots className="h-4 w-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-36">
                                      <DropdownMenuItem
                                        className="text-red-400 hover:text-red-500 focus:text-red-500"
                                        onClick={() => handleDeleteComment(comment.id)}
                                        disabled={deletingId === comment.id}
                                      >
                                        <IconTrash className="h-4 w-4 mr-0 text-current" />
                                        {deletingId === comment.id ? 'Deleting...' : 'Delete'}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-foreground leading-relaxed">
                            {comment.comment}
                          </div>
                        </div>
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
              </div>

              {/* Comment Input */}
              <div className="px-3 pb-3 bg-[#ebebeb] dark:bg-[#0a0a0a]">
                <div className="flex gap-3 bg-sidebar rounded-lg p-4 border">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="" alt="Current User" />
                    <AvatarFallback className="text-xs">CU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <form onSubmit={handleCommentSubmit}>
                      <Input 
                        placeholder="Write a comment..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="text-sm"
                        disabled={isSubmittingComment}
                      />
                    </form>
                  </div>
                  <Button 
                    size="sm" 
                    className="rounded-lg" 
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
