"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCalendar, IconClock, IconUser, IconBuilding, IconMapPin, IconFile, IconMessage, IconEdit, IconTrash, IconShare, IconCopy, IconDownload, IconEye, IconTag, IconPhone, IconMail, IconId, IconBriefcase, IconCalendarTime, IconCircle, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getStorageUrl } from "@/lib/supabase"
import { useTheme } from "next-themes"

interface TicketDetailModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
}

interface StatusOption {
  value: string
  label: string
  icon: string
  color: string
}

interface Ticket {
  id: number
  ticket_id: string
  user_id: number
  concern: string
  details: string | null
  category: string
  category_id: number | null
  category_name?: string
  status: TicketStatus
  position: number
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  sector: string
  station_id: string | null
  profile_picture: string | null
  first_name: string | null
  last_name: string | null
  employee_id: string | null
  supporting_files?: string[]
  file_count?: number
  // Additional fields from joins
  user_email?: string
  user_type?: string
  member_company?: string
  member_name?: string
  member_color?: string
  member_address?: string
  member_phone?: string
  department_name?: string
  agent_exp_points?: number
  job_title?: string
  shift_period?: string
  shift_schedule?: string
  shift_time?: string
  work_setup?: string
  employment_status?: string
  hire_type?: string
  staff_source?: string
  start_date?: string
  exit_date?: string
  resolved_by_name?: string
  resolved_by_email?: string
}

type TicketStatus = 'For Approval' | 'On Hold' | 'In Progress' | 'New' | 'Approved' | 'Stuck' | 'Actioned' | 'Closed'

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "For Approval":
      return "text-yellow-700 dark:text-white border-yellow-600/20 bg-yellow-50 dark:bg-yellow-600/20"
    case "On Hold":
      return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
    case "In Progress":
      return "text-orange-700 dark:text-white border-orange-600/20 bg-orange-50 dark:bg-orange-600/20"
    case "New":
    case "Approved":
      return "text-blue-700 dark:text-white border-blue-600/20 bg-blue-50 dark:bg-blue-600/20"
    case "Stuck":
      return "text-red-700 dark:text-white border-red-600/20 bg-red-50 dark:bg-red-600/20"
    case "Actioned":
      return "text-purple-700 dark:text-white border-purple-600/20 bg-purple-50 dark:bg-purple-600/20"
    case "Closed":
      return "text-green-700 dark:text-white border-green-600/20 bg-green-50 dark:bg-green-600/20"
    default:
      return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
  }
}

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case "For Approval":
      return <IconAlertCircle className="h-4 w-4" />
    case "On Hold":
      return <IconClock className="h-4 w-4" />
    case "In Progress":
      return <IconEdit className="h-4 w-4" />
    case "New":
    case "Approved":
      return <IconCircle className="h-4 w-4" />
    case "Stuck":
      return <IconAlertCircle className="h-4 w-4" />
    case "Actioned":
      return <IconCircle className="h-4 w-4" />
    case "Closed":
      return <IconCircle className="h-4 w-4" />
    default:
      return <IconInfoCircle className="h-4 w-4" />
  }
}

const getCategoryBadge = (ticket: Ticket) => {
  const categoryColors: Record<string, string> = {
    'Computer & Equipment': 'bg-blue-100 text-blue-800',
    'Network & Internet': 'bg-cyan-100 text-cyan-800',
    'Station': 'bg-purple-100 text-purple-800',
    'Surroundings': 'bg-green-100 text-green-800',
    'Schedule': 'bg-yellow-100 text-yellow-800',
    'Compensation': 'bg-orange-100 text-orange-800',
    'Transport': 'bg-indigo-100 text-indigo-800',
    'Suggestion': 'bg-pink-100 text-pink-800',
    'Check-in': 'bg-gray-100 text-gray-800'
  }
  
  return {
    name: ticket.category_name || ticket.category,
    color: categoryColors[ticket.category_name || ticket.category] || 'bg-gray-100 text-gray-800'
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

const getDisplayStatus = (status: string) => {
  if (status === 'Approved') return 'New'
  return status
}

export function TicketDetailModal({ ticket, isOpen, onClose }: TicketDetailModalProps) {
  const { theme } = useTheme()
  const [comment, setComment] = React.useState("")
  const [currentStatus, setCurrentStatus] = React.useState<TicketStatus | null>(null)
  const [statusOptions, setStatusOptions] = React.useState<StatusOption[]>([])
  const [comments, setComments] = React.useState<any[]>([])
  const [isLoadingComments, setIsLoadingComments] = React.useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)

  // Define status options based on application usage
  const getStatusOptions = (): StatusOption[] => [
    { value: 'New', label: 'New', icon: 'blue', color: 'blue' },
    { value: 'In Progress', label: 'In Progress', icon: 'orange', color: 'orange' },
    { value: 'Stuck', label: 'Stuck', icon: 'red', color: 'red' },
    { value: 'Actioned', label: 'Actioned', icon: 'purple', color: 'purple' },
    { value: 'Closed', label: 'Closed', icon: 'green', color: 'green' },
    { value: 'On Hold', label: 'On Hold', icon: 'gray', color: 'gray' }
  ]

  React.useEffect(() => {
    if (ticket) {
      setCurrentStatus(ticket.status)
      fetchComments()
    }
    setStatusOptions(getStatusOptions())
  }, [ticket])

  const fetchComments = async () => {
    if (!ticket) return
    
    setIsLoadingComments(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      } else {
        console.error('Failed to fetch comments')
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  if (!ticket) return null

  const categoryBadge = getCategoryBadge(ticket)
  const createdDate = formatDate(ticket.created_at)
  const updatedDate = ticket.updated_at && ticket.updated_at !== ticket.created_at ? formatDate(ticket.updated_at) : null
  const resolvedDate = ticket.resolved_at ? formatDate(ticket.resolved_at) : null

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticket.ticket_id)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !ticket || isSubmittingComment) return
    
    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment.trim() })
      })
      
      if (response.ok) {
        const data = await response.json()
        setComments(prev => [...prev, data.comment])
        setComment("")
      } else {
        const errorData = await response.json()
        console.error('Failed to submit comment:', errorData)
        alert(`Failed to submit comment: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as TicketStatus)
    // TODO: Implement API call to update ticket status
    console.log('Status changed to:', newStatus)
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 rounded-xl" style={{ 
          backgroundColor: theme === 'dark' ? '#111111' : '#f8f9fa' 
        }}>
          <div className="flex h-[95vh]">
            {/* Left Panel - Task Details */}
            <div className="flex-1 flex flex-col">
                                                           {/* Top Navigation Bar */}
               <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b">
                                                     <div className="flex items-center gap-3">
                    <span className="text-lg font-mono text-primary">
                      {ticket.ticket_id}
                    </span>
                  </div>
               </div>

                                                {/* Task Header */}
                 <div className="px-6 py-5">
                   {/* Task Title */}
                   <h1 className="text-2xl font-semibold mb-4">
                     {ticket.concern}
                   </h1>
                   
                                       {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                                            {/* User */}
                      <div className="flex items-center gap-2">
                        <IconUser className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">User:</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.profile_picture || ''} alt="User" />
                            <AvatarFallback className="text-xs">
                              {ticket.first_name && ticket.last_name 
                                ? `${ticket.first_name[0]}${ticket.last_name[0]}`
                                : 'U'
                              }
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {ticket.first_name && ticket.last_name 
                              ? `${ticket.first_name} ${ticket.last_name}`
                              : `User ${ticket.user_id}`
                            }
                          </span>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <IconCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Status:</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-muted/50 active:bg-muted/70 transition-colors">
                              <Badge variant="outline" className={`${getStatusColor(currentStatus || ticket.status)} px-2 py-1 text-xs cursor-pointer hover:opacity-80 transition-opacity`}>
                                {getDisplayStatus(currentStatus || ticket.status)}
                              </Badge>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-1">
                              {statusOptions.map((option) => (
                                <div 
                                  key={option.value}
                                  className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                                    (currentStatus || ticket.status) === option.value 
                                      ? 'bg-primary/10 text-primary border border-primary/20' 
                                      : 'hover:bg-muted/50 active:bg-muted/70 text-muted-foreground hover:text-foreground'
                                  }`}
                                  onClick={() => handleStatusChange(option.value)}
                                >
                                  {option.icon === 'yellow' ? (
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                  ) : option.icon === 'orange' ? (
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                  ) : option.icon === 'blue' ? (
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                  ) : option.icon === 'green' ? (
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  ) : option.icon === 'red' ? (
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  ) : option.icon === 'purple' ? (
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                  ) : (
                                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                  )}
                                  <span className="text-sm font-medium">{option.label}</span>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      {/* Company */}
                      {ticket.member_name && (
                        <div className="flex items-center gap-2">
                          <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Company:</span>
                          <span 
                            className="font-medium"
                            style={{ color: ticket.member_color || undefined }}
                          >
                            {ticket.member_name}
                          </span>
                        </div>
                      )}
                      
                      {/* Category */}
                      <div className="flex items-center gap-2">
                        <IconTag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline" className={`${categoryBadge.color} px-2 py-1 text-xs`}>
                          {categoryBadge.name}
                        </Badge>
                      </div>
                      
                      {/* Station */}
                      {ticket.station_id && (
                        <div className="flex items-center gap-2">
                          <IconBuilding className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Station:</span>
                          <span className="font-medium">{ticket.station_id}</span>
                        </div>
                      )}
                      
                      {/* Dates */}
                      <div className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Filed at:</span>
                        <span className="font-medium">{createdDate.date} • {createdDate.time}</span>
                      </div>
                   </div>
                </div>
                <div className="px-6">
                  <Separator />
                </div>

              {/* Task Description */}
              <div className="flex-1 px-6 py-5 overflow-y-auto">
                <div className="space-y-6">
                  {/* Additional Details Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-muted-foreground">Additional Details</h3>
                    <div className="rounded-lg p-6 text-sm leading-relaxed min-h-[120px] border">
                      {ticket.details || "No additional details provided."}
                    </div>
                  </div>

                  {/* Subtasks Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-muted-foreground">Subtasks</h3>
                    <div className="rounded-lg p-6 text-sm leading-relaxed min-h-[120px] border">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary hidden"></div>
                          </div>
                          <span className="text-sm">Investigate network connectivity issues</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          <span className="text-sm line-through text-muted-foreground">Contact user for additional information</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary hidden"></div>
                          </div>
                          <span className="text-sm">Update DNS configuration</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary hidden"></div>
                          </div>
                          <span className="text-sm">Test network connectivity</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary hidden"></div>
                          </div>
                          <span className="text-sm">Document resolution steps</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-muted-foreground">Attachments</h3>
                    <div className="rounded-lg p-6 text-sm leading-relaxed min-h-[120px] border">
                      {ticket.supporting_files && Array.isArray(ticket.supporting_files) && ticket.supporting_files.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                          {ticket.supporting_files.map((file, index) => {
                            // Get proper Supabase Storage URL for full quality
                            const fileUrl = getStorageUrl(file);
                            // Get optimized URL for preview
                            const previewUrl = getStorageUrl(file, true);
                            // Extract filename from Supabase Storage URL
                            const fileName = file.split('/').pop() || file;
                            
                            // Debug logging
                            console.log('File processing:', { 
                              originalFile: file, 
                              fileUrl, 
                              fileName,
                              supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
                            });
                            const fileExtension = fileName.split('.').pop()?.toLowerCase();
                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
                            const isPdf = fileExtension === 'pdf';
                            const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension || '');
                            
                            let gradientClass = 'from-blue-500/20 to-purple-500/20';
                            let iconColor = 'text-blue-600 dark:text-blue-400';
                            let bgColor = 'bg-blue-100 dark:bg-blue-900/20';
                            
                            if (isImage) {
                              gradientClass = 'from-green-500/20 to-blue-500/20';
                              iconColor = 'text-green-600 dark:text-green-400';
                              bgColor = 'bg-green-100 dark:bg-green-900/20';
                            } else if (isPdf) {
                              gradientClass = 'from-red-500/20 to-orange-500/20';
                              iconColor = 'text-red-600 dark:text-red-400';
                              bgColor = 'bg-red-100 dark:bg-red-900/20';
                            } else if (isArchive) {
                              gradientClass = 'from-purple-500/20 to-pink-500/20';
                              iconColor = 'text-purple-600 dark:text-purple-400';
                              bgColor = 'bg-purple-100 dark:bg-purple-900/20';
                            }
                            
                            return (
                              <div 
                                key={index} 
                                className="rounded-lg overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
                                style={{ 
                                  backgroundColor: theme === 'dark' ? '#252525' : '#ffffff',
                                  border: theme === 'dark' ? '1px solid #333333' : '1px solid #e5e7eb'
                                }}
                                onClick={() => {
                                  if (typeof window !== 'undefined' && (window as any).electronAPI) {
                                    (window as any).electronAPI.openFileWindow(fileUrl, fileName)
                                      .then((result: any) => {
                                        if (result.success) {
                                          console.log('File window opened successfully')
                                        } else {
                                          console.error('Failed to open file window:', result.error)
                                          // Fallback to browser window if Electron fails
                                          window.open(fileUrl, '_blank')
                                        }
                                      })
                                      .catch((error: any) => {
                                        console.error('Error opening file window:', error)
                                        // Fallback to browser window if Electron fails
                                        window.open(fileUrl, '_blank')
                                      })
                                  } else {
                                    // Fallback to browser window if not in Electron
                                    window.open(fileUrl, '_blank')
                                  }
                                }}
                                title={`Click to view ${fileName}`}
                              >
                                <div className={`w-full h-20 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                                  {isImage ? (
                                    <img 
                                      src={previewUrl} 
                                      alt={fileName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to icon if image fails to load
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.style.display = 'none';
                                        const nextSibling = target.nextElementSibling as HTMLElement;
                                        if (nextSibling) {
                                          nextSibling.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center ${isImage ? 'hidden' : ''}`}>
                                    <IconFile className={`h-4 w-4 ${iconColor}`} />
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="text-xs font-medium truncate">{fileName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {ticket.created_at ? formatDate(ticket.created_at).full : 'Unknown date'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <IconFile className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No attachments</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Activity Log */}
            <div className="w-96 flex flex-col border-l h-full">
                             {/* Activity Header */}
               <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b flex-shrink-0">
                 <h3 className="font-medium">Activity</h3>
               </div>

              {/* Activity Content */}
                              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 bg-card">
                  <div className="space-y-4">
                    {isLoadingComments ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-muted-foreground">Loading comments...</div>
                      </div>
                    ) : comments.length > 0 ? (
                      comments.map((comment) => {
                        const userName = comment.first_name && comment.last_name
                          ? `${comment.first_name} ${comment.last_name}`.trim()
                          : comment.email || 'Unknown User'
                        
                        const userInitials = comment.first_name && comment.last_name
                          ? `${comment.first_name[0]}${comment.last_name[0]}`.toUpperCase()
                          : comment.email?.[0]?.toUpperCase() || 'U'
                        
                        const commentDate = formatDate(comment.created_at)
                        
                        return (
                          <div key={comment.id} className="rounded-lg p-4 bg-sidebar border">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                {comment.profile_picture ? (
                                  <img 
                                    src={comment.profile_picture} 
                                    alt={userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    {userInitials}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">{userName}</span>
                                  <IconMessage className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                  {commentDate.full}
                                </div>
                                <div className="text-xs text-muted-foreground leading-relaxed">
                                  {comment.comment}
                                </div>
                              </div>
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
              <div className="px-3 pb-3 bg-card">
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