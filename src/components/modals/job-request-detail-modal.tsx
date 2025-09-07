"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { IconCalendar, IconClock, IconUser, IconBuilding, IconMapPin, IconFile, IconMessage, IconEdit, IconTrash, IconShare, IconCopy, IconDownload, IconEye, IconTag, IconPhone, IconMail, IconId, IconBriefcase, IconCalendarTime, IconAlertCircle, IconInfoCircle, IconVideo, IconCash, IconExternalLink, IconAward, IconCode, IconSparkles, IconUsers, IconTarget, IconTrendingUp } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { DataFieldRow } from "@/components/ui/fields"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"



interface JobRequestDetailModalProps {
  jobRequest: JobRequest | null
  isOpen: boolean
  onClose: () => void
  pageContext?: 'job-requests' | 'dashboard' | 'recruitment'
}

interface JobRequest {
  id: string
  jobTitle: string
  jobDescription: string
  industry: string
  department: string
  workArrangement: "onsite" | "remote" | "hybrid" | ""
  salaryMin?: number | ""
  salaryMax?: number | ""
  experienceLevel: "entry-level" | "mid-level" | "senior-level" | ""
  applicationDeadline?: string
  workType: "full-time"
  currency: "PHP"
  salaryType: "monthly"
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  status: string
  created_at: string
  updated_at: string
  // Additional fields for display
  created_by_name?: string | null
  created_by_email?: string | null
  created_by_profile_picture?: string | null
  applicants_count?: number
  interviews_scheduled?: number
  offers_made?: number
  // AI analysis data
  aiAnalysis?: {
    overall_score?: number
    market_analysis?: any
    salary_benchmark?: any
    skills_demand?: any
    recommendations?: any[]
  } | null
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-green-700 dark:text-white border-green-600/20 bg-green-50 dark:bg-green-600/20"
    case "inactive":
      return "text-yellow-700 dark:text-white border-yellow-600/20 bg-yellow-50 dark:bg-yellow-600/20"
    case "closed":
      return "text-red-700 dark:text-white border-red-600/20 bg-red-50 dark:bg-red-600/20"
    case "processed":
      return "text-blue-700 dark:text-white border-blue-600/20 bg-blue-50 dark:bg-blue-600/20"
    default:
      return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
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

export function JobRequestDetailModal({ jobRequest, isOpen, onClose, pageContext = 'job-requests' }: JobRequestDetailModalProps) {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [comment, setComment] = useState("")

  const [comments, setComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  
  // Local state for job request data to handle realtime updates
  const [localJobRequest, setLocalJobRequest] = useState<JobRequest | null>(null)
  
  // Editable input values
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    jobTitle: '',
    jobDescription: '',
    salaryMin: '',
    salaryMax: ''
  })
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({
    jobTitle: '',
    jobDescription: '',
    salaryMin: '',
    salaryMax: ''
  })

  // Update local job request when prop changes
  useEffect(() => {
    if (jobRequest) {
      console.log('🔍 Modal Loading Job Request Data:', {
        id: jobRequest.id,
        jobTitle: jobRequest.jobTitle,
        status: jobRequest.status,
        department: jobRequest.department
      })
      
      setLocalJobRequest(jobRequest)
      // Reset input values when job request changes
      const initialValues = {
        jobTitle: String(jobRequest.jobTitle || ''),
        jobDescription: String(jobRequest.jobDescription || ''),
        salaryMin: String(jobRequest.salaryMin || ''),
        salaryMax: String(jobRequest.salaryMax || '')
      }
      setInputValues(initialValues)
      setOriginalValues(initialValues)
    }
  }, [jobRequest])

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px'
      document.documentElement.style.overflow = 'hidden'
      document.body.classList.add('overflow-hidden')
      document.body.style.cssText += '; overflow: hidden !important; position: fixed; width: 100%;'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('overflow-hidden')
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.cssText = document.body.style.cssText.replace(/overflow:\s*hidden\s*!important;?\s*/g, '')
    }
  }, [isOpen])

  // Cleanup function to restore scroll when component unmounts
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('overflow-hidden')
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.cssText = document.body.style.cssText.replace(/overflow:\s*hidden\s*!important;?\s*/g, '')
    }
  }, [])

  // Handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    console.log(`🔄 Input change for ${fieldName}:`, value)
    
    // For salary fields, only allow numbers
    if (fieldName === 'salaryMin' || fieldName === 'salaryMax') {
      // Remove all non-numeric characters except decimal point (including commas)
      let numericValue = value.replace(/[^0-9.]/g, '')
      console.log(`🔢 Filtered numeric value:`, numericValue)
      
      // Ensure only one decimal point
      const parts = numericValue.split('.')
      if (parts.length > 2) {
        // Keep only the first two parts (before and after first decimal)
        numericValue = parts[0] + '.' + parts.slice(1).join('')
        console.log(`🔢 Fixed multiple decimals:`, numericValue)
      }
      
      // Prevent extremely large numbers
      if (numericValue.length > 17) { // Max 17 characters for numeric(15,2): 999,999,999,999.99
        console.log(`⚠️ Number too long, truncating:`, numericValue)
        numericValue = numericValue.substring(0, 17)
      }
      
      // Update with filtered value
      setInputValues(prev => ({ ...prev, [fieldName]: numericValue }))
      console.log(`✅ Updated ${fieldName} to:`, numericValue)
      
      // Also update the local job request state for instant feedback
      if (localJobRequest) {
        setLocalJobRequest(prev => {
          if (!prev) return prev
          if (fieldName === 'salaryMin') {
            return {
              ...prev,
              salaryMin: parseFloat(numericValue) || undefined
            }
          } else if (fieldName === 'salaryMax') {
            return {
              ...prev,
              salaryMax: parseFloat(numericValue) || undefined
            }
          }
          return prev
        })
      }
    } else {
      // For non-salary fields, allow any input
      setInputValues(prev => ({ ...prev, [fieldName]: value }))
      
      // Also update the local job request state for instant feedback
      if (localJobRequest) {
        setLocalJobRequest(prev => ({
          ...prev!,
          [fieldName]: value
        }))
      }
    }
  }

  // Format number with commas and hide unnecessary decimals
  const formatNumber = (value: string | number | null): string => {
    if (value === null || value === undefined || value === '' || value === 0) return ''
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return String(value)
    
    // Format with commas and 2 decimal places
    const formatted = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    
    return formatted
  }

  if (!localJobRequest) return null

  const createdDate = formatDate(localJobRequest.created_at)
  const updatedDate = localJobRequest.updated_at && localJobRequest.updated_at !== localJobRequest.created_at ? formatDate(localJobRequest.updated_at) : null

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !localJobRequest || isSubmittingComment) return
    
    // TODO: Implement comment submission when API is ready
    setIsSubmittingComment(true)
    setTimeout(() => {
      setComment("")
      setIsSubmittingComment(false)
    }, 1000)
  }

  // Simple close handler
  const handleClose = () => {
    console.log('🔒 handleClose called:', { 
      jobRequest: localJobRequest?.id, 
      isOpen
    })
    onClose()
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="max-w-7xl max-h-[95vh] overflow-hidden p-0 rounded-xl" 
          style={{ 
          backgroundColor: theme === 'dark' ? '#111111' : '#f8f9fa' 
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex h-[95vh]">
            {/* Left Panel - Job Request Details */}
            <div className="flex-1 flex flex-col">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b border-[#cecece99] dark:border-border">
                <div className="flex items-center gap-3">
                  <Badge className="text-xs h-6 flex items-center rounded-[6px]">
                    Job Request
                  </Badge>
                </div>
              </div>

              {/* Job Request Header */}
              <div className="px-6 py-5">
                {/* Job Title and Basic Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-semibold mb-2">
                        {localJobRequest.jobTitle}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge 
                        variant="outline"
                        className={`text-xs h-6 flex items-center rounded-[6px] px-2 py-1 ${getStatusColor(localJobRequest.status)}`}
                      >
                        {localJobRequest.status.charAt(0).toUpperCase() + localJobRequest.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Application Statistics in Header */}
                  <div className="mt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg p-4 border shadow-sm text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {localJobRequest.applicants_count || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Applicants</p>
                      </div>
                      <div className="rounded-lg p-4 border shadow-sm text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {localJobRequest.interviews_scheduled || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                      </div>
                      <div className="rounded-lg p-4 border shadow-sm text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {localJobRequest.offers_made || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Offers Made</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="px-6">
                <Separator />
              </div>

              {/* Job Request Details */}
              <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
                <div className="space-y-6">
                    {/* Job Description Section */}
                    <div>
                      <div className="flex items-center justify-between min-h-[40px]">
                        <h3 className="text-lg font-medium text-muted-foreground">Job Description</h3>
                      </div>
                      <div className="rounded-lg p-6 text-sm leading-relaxed border shadow-sm">
                        {localJobRequest.jobDescription || "No description provided."}
                      </div>
                    </div>

                    {/* Job Information Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information Section */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between min-h-[40px]">
                          <h3 className="text-lg font-medium text-muted-foreground">Basic Information</h3>
                        </div>
                        <div className="rounded-lg border border-[#cecece99] dark:border-border overflow-hidden">
                          <DataFieldRow
                            icon={<IconClock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            label="Work Type"
                            fieldName="workType"
                            value={localJobRequest.workType ? localJobRequest.workType.charAt(0).toUpperCase() + localJobRequest.workType.slice(1) : ''}
                            onSave={() => {}} // Empty function since it's read-only
                            readOnly={true}
                          />
                          <DataFieldRow
                            icon={<IconMapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            label="Work Arrangement"
                            fieldName="workArrangement"
                            value={localJobRequest.workArrangement ? localJobRequest.workArrangement.charAt(0).toUpperCase() + localJobRequest.workArrangement.slice(1) : ''}
                            onSave={() => {}} // Empty function since it's read-only
                            readOnly={true}
                            isLast={!localJobRequest.applicationDeadline}
                          />
                          {localJobRequest.applicationDeadline && (
                            <DataFieldRow
                              icon={<IconCalendarTime className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                              label="Application Deadline"
                              fieldName="applicationDeadline"
                              value={new Date(localJobRequest.applicationDeadline).toLocaleDateString('en-US', { 
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                              })}
                              onSave={() => {}} // Empty function since it's read-only
                              readOnly={true}
                              isLast={true}
                            />
                          )}
                        </div>
                      </div>

                      {/* Experience & Salary Section */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between min-h-[40px]">
                          <h3 className="text-lg font-medium text-muted-foreground">Experience & Salary</h3>
                        </div>
                        <div className="rounded-lg border border-[#cecece99] dark:border-border overflow-hidden">
                          <DataFieldRow
                            icon={<IconTrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            label="Experience Level"
                            fieldName="experienceLevel"
                            value={localJobRequest.experienceLevel ? localJobRequest.experienceLevel.charAt(0).toUpperCase() + localJobRequest.experienceLevel.slice(1) : ''}
                            onSave={() => {}} // Empty function since it's read-only
                            readOnly={true}
                          />
                          <DataFieldRow
                            icon={<IconCash className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            label="Salary Range"
                            fieldName="salaryRange"
                            value={
                              localJobRequest.salaryMin && localJobRequest.salaryMax 
                                ? `₱${formatNumber(localJobRequest.salaryMin)} - ₱${formatNumber(localJobRequest.salaryMax)}`
                                : localJobRequest.salaryMin 
                                  ? `₱${formatNumber(localJobRequest.salaryMin)}+`
                                  : localJobRequest.salaryMax
                                    ? `Up to ₱${formatNumber(localJobRequest.salaryMax)}`
                                    : ''
                            }
                            onSave={() => {}} // Empty function since it's read-only
                            readOnly={true}
                          />
                          <DataFieldRow
                            icon={<IconTag className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            label="Currency"
                            fieldName="currency"
                            value={localJobRequest.currency || ''}
                            onSave={() => {}} // Empty function since it's read-only
                            readOnly={true}
                          />
                          <DataFieldRow
                            icon={<IconCalendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            label="Salary Type"
                            fieldName="salaryType"
                            value={localJobRequest.salaryType ? localJobRequest.salaryType.charAt(0).toUpperCase() + localJobRequest.salaryType.slice(1) : ''}
                            onSave={() => {}} // Empty function since it's read-only
                            readOnly={true}
                            isLast={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Requirements Section */}
                    <div>
                      <div className="flex items-center justify-between min-h-[40px]">
                        <h3 className="text-lg font-medium text-muted-foreground">Requirements</h3>
                      </div>
                      <div className="rounded-lg p-6 border shadow-sm">
                        {localJobRequest.requirements && localJobRequest.requirements.length > 0 ? (
                          <ul className="space-y-2">
                            {localJobRequest.requirements.map((requirement: string, index: number) => (
                              <li key={index} className="text-sm text-foreground flex items-center gap-2">
                                <span className="text-primary flex-shrink-0">•</span>
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-sm text-muted-foreground">No specific requirements listed</span>
                        )}
                      </div>
                    </div>

                    {/* Responsibilities Section */}
                    <div>
                      <div className="flex items-center justify-between min-h-[40px]">
                        <h3 className="text-lg font-medium text-muted-foreground">Responsibilities</h3>
                      </div>
                      <div className="rounded-lg p-6 border shadow-sm">
                        {localJobRequest.responsibilities && localJobRequest.responsibilities.length > 0 ? (
                          <ul className="space-y-2">
                            {localJobRequest.responsibilities.map((responsibility: string, index: number) => (
                              <li key={index} className="text-sm text-foreground flex items-center gap-2">
                                <span className="text-primary flex-shrink-0">•</span>
                                <span>{responsibility}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-sm text-muted-foreground">No specific responsibilities listed</span>
                        )}
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                      <div className="flex items-center justify-between min-h-[40px]">
                        <h3 className="text-lg font-medium text-muted-foreground">Required Skills</h3>
                      </div>
                      <div className="rounded-lg p-6 border shadow-sm">
                        {localJobRequest.skills && localJobRequest.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {localJobRequest.skills.map((skill: string, index: number) => (
                              <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No specific skills required</span>
                        )}
                      </div>
                    </div>

                    {/* Benefits Section */}
                    <div>
                      <div className="flex items-center justify-between min-h-[40px]">
                        <h3 className="text-lg font-medium text-muted-foreground">Benefits & Perks</h3>
                      </div>
                      <div className="rounded-lg p-6 border shadow-sm">
                        {localJobRequest.benefits && localJobRequest.benefits.length > 0 ? (
                          <ul className="space-y-2">
                            {localJobRequest.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="text-sm text-foreground flex items-center gap-2">
                                <span className="text-primary flex-shrink-0">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-sm text-muted-foreground">No benefits specified</span>
                        )}
                      </div>
                    </div>



                </div>
              </div>
            </div>

            {/* Right Panel - Activity Log */}
            <div className="w-96 flex flex-col border-l border-[#cecece99] dark:border-border h-full bg-[#ececec] dark:bg-[#0a0a0a]">
              {/* Activity Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b border-[#cecece99] dark:border-border flex-shrink-0">
                <h3 className="font-medium">Activity</h3>
              </div>

              {/* Activity Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 bg-[#ececec] dark:bg-[#0a0a0a]">
                <div className="space-y-4">
                  {isLoadingComments ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-muted-foreground">Loading comments...</div>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="rounded-lg p-4 bg-sidebar border">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-primary">
                                  CU
                                </span>
                              </div>
                              <span className="text-sm font-medium truncate">Commenter Name</span>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-3">Date • Time</span>
                          </div>
                          <div className="text-sm text-foreground leading-relaxed mt-1 whitespace-pre-wrap break-words">
                            {comment.comment}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <IconMessage className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No Comments Yet</p>
                      <p className="text-xs">Be the first to add a comment!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Input */}
              <div className="px-3 pb-3 bg-[#ececec] dark:bg-[#0a0a0a]">
                <div className="flex gap-3 bg-sidebar rounded-lg p-4 border border-[#cecece99] dark:border-border">
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
