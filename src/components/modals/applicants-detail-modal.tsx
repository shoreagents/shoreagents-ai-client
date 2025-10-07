"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { IconCalendar, IconClock, IconUser, IconBuilding, IconMapPin, IconFile, IconEdit, IconTrash, IconShare, IconCopy, IconDownload, IconEye, IconTag, IconPhone, IconMail, IconId, IconBriefcase, IconCalendarTime, IconAlertCircle, IconInfoCircle, IconVideo, IconCash, IconExternalLink, IconAward, IconCode, IconSparkles } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { EditableField, DataFieldRow } from "@/components/ui/fields"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useTheme } from "next-themes"
import { useRealtimeApplicants } from "@/hooks/use-realtime-applicants"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface ApplicantsDetailModalProps {
  applicant: Applicant | null
  isOpen: boolean
  onClose: () => void
  pageContext?: 'talent-pool' | 'bpoc-recruits' | 'applicants-records'
}



interface Applicant {
  id: string
  applicant_id?: string | null
  user_id: string
  resume_slug?: string | null
  details: string | null
  status: string
  created_at: string
  updated_at: string
  profile_picture: string | null
  first_name: string | null
  last_name: string | null
  full_name?: string | null
  employee_id: string | null
  job_title?: string | null
  company_name?: string | null
  user_position?: string | null
  // Additional fields from recruits table
  video_introduction_url?: string | null
  current_salary?: number | null
  expected_monthly_salary?: number | null
  shift?: string | null
  // Skills data from BPOC database
  skills?: string[]
  // Interested clients data
  interested_clients?: {
    user_id: number
    first_name: string | null
    last_name: string | null
    profile_picture: string | null
    employee_id: string | null
  }[]
  originalSkillsData?: any
  // Summary from BPOC database
  summary?: string | null
  // Email from BPOC database
  email?: string | null
  // Phone and address from BPOC database
  phone?: string | null
  address?: string | null
  // AI analysis data from BPOC database
  aiAnalysis?: {
    overall_score?: number
    key_strengths?: any[]
    strengths_analysis?: any
    improvements?: any[]
    recommendations?: any[]
    improved_summary?: string
    salary_analysis?: any
    career_path?: any
    section_analysis?: any
  } | null
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

export function ApplicantsDetailModal({ applicant, isOpen, onClose, pageContext = 'bpoc-recruits' }: ApplicantsDetailModalProps) {
  const { theme } = useTheme()
  const { user } = useAuth()

  const [interestStatus, setInterestStatus] = useState<'none' | 'interested' | 'already_interested'>('none')
  const [hasCheckedInterest, setHasCheckedInterest] = useState(false)

  const [activeTab, setActiveTab] = useState("information")
  
  // Local state for applicant data to handle realtime updates
  const [localApplicant, setLocalApplicant] = useState<Applicant | null>(null)
  
  // Editable input values
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    expected_monthly_salary: '',
    video_introduction_url: ''
  })
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({
    expected_monthly_salary: '',
    video_introduction_url: ''
  })
  

  
  // Real-time updates for applicant data (separate from BPOC job status updates)
  const { isConnected: isRealtimeConnected } = useRealtimeApplicants({
    onApplicantUpdated: (updatedApplicant, oldApplicant) => {
      console.log('🔄 Real-time: Applicant update received in modal:', { 
        updatedApplicant, 
        oldApplicant, 
        currentApplicantId: localApplicant?.id,
        modalIsOpen: isOpen,
        hasLocalApplicant: !!localApplicant
      })
      
      // Only process updates for the current applicant
      if (localApplicant && updatedApplicant.id === localApplicant.id) {
        console.log('🔄 Real-time: Processing update for current applicant:', updatedApplicant)
        
        // Update the local applicant state with new data
        setLocalApplicant(prevApplicant => {
          if (!prevApplicant) return prevApplicant
          
          const updatedLocalApplicant = { ...prevApplicant }
          
          // Update all fields from the realtime update
          Object.keys(updatedApplicant).forEach(fieldName => {
            if (fieldName in updatedLocalApplicant) {
              (updatedLocalApplicant as any)[fieldName] = updatedApplicant[fieldName]
            }
          })
          
          console.log('🔄 Updated local applicant:', updatedLocalApplicant)
          return updatedLocalApplicant
        })
        
        // Update input values to reflect the new data
        const newValues = {
          expected_monthly_salary: String(updatedApplicant.expected_monthly_salary || ''),
          video_introduction_url: String(updatedApplicant.video_introduction_url || '')
        }
        console.log('🔄 Setting new input values:', newValues)
        
        // Update input values immediately (no delay)
        setInputValues(newValues)
        
        // Update original values to reflect the new data
        setOriginalValues(newValues)
        


      } else {
        console.log('🔄 Real-time: Update not for current applicant, skipping')
      }
    }
  })


  // Log connection status for debugging
  console.log('🔍 Modal connection status:', { 
    isRealtimeConnected,
    applicantId: localApplicant?.id
  })

  // Update local applicant when prop changes
  useEffect(() => {
    if (applicant) {
      console.log('🔍 Modal Loading Applicant Data:', {
        id: applicant.id,
        status: applicant.status
      })
      
      setLocalApplicant(applicant)
      // Reset input values when applicant changes
      const initialValues = {
        expected_monthly_salary: String(applicant.expected_monthly_salary || ''),
        video_introduction_url: String(applicant.video_introduction_url || '')
      }
      setInputValues(initialValues)
      setOriginalValues(initialValues)
      
      // Reset interest status when applicant changes
      setInterestStatus('none')
      setHasCheckedInterest(false)
    }
  }, [applicant])

  // Check if user has already expressed interest when modal opens
  useEffect(() => {
    const checkExistingInterest = async () => {
      if (!localApplicant || !user || hasCheckedInterest) return

      try {
        setHasCheckedInterest(true) // Mark as checked to prevent duplicate calls
        const response = await fetch(`/api/bpoc/interest?applicantId=${localApplicant.applicant_id || localApplicant.id}&userId=${user?.id}`)

        const data = await response.json()

        if (response.ok && data.alreadyInterested) {
          setInterestStatus('already_interested')
        }
      } catch (error) {
        console.error('Error checking existing interest:', error)
        setHasCheckedInterest(false) // Reset on error so it can be retried
        // Don't show error to user for this background check
      }
    }

    // Only check interest when modal opens and we have the necessary data
    if (isOpen && localApplicant && user && !hasCheckedInterest) {
      checkExistingInterest()
    }
  }, [isOpen, localApplicant?.id, user?.id, hasCheckedInterest])





  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // No debounced save to clear
    }
  }, [])














  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Reset active tab to Personal Info when modal opens
      setActiveTab("information")
      
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
    if (fieldName === 'expected_monthly_salary') {
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
      
      // Also update the local applicant state for instant feedback
      if (localApplicant) {
        setLocalApplicant(prev => {
          if (!prev) return prev
          if (fieldName === 'expected_monthly_salary') {
            return {
              ...prev,
              expected_monthly_salary: parseFloat(numericValue) || null
            }
          }
          return {
            ...prev,
            [fieldName]: numericValue
          }
        })
      }
    } else {
      // For non-salary fields, allow any input
    setInputValues(prev => ({ ...prev, [fieldName]: value }))
      
      // Also update the local applicant state for instant feedback
      if (localApplicant) {
        setLocalApplicant(prev => ({
          ...prev!,
          [fieldName]: value
        }))
      }
    }
    
    // No auto-save while typing - only save on blur or Enter
  }

  // Handle saving input values



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

  if (!localApplicant) return null

  const createdDate = formatDate(localApplicant.created_at)
  const updatedDate = localApplicant.updated_at && localApplicant.updated_at !== localApplicant.created_at ? formatDate(localApplicant.updated_at) : null










  // Handle expressing interest in candidate
  const handleExpressInterest = async () => {
    if (!localApplicant || !user) return

    try {
      // Get the Supabase session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No valid session found')
      }

      const response = await fetch('/api/bpoc/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicantId: localApplicant.applicant_id || localApplicant.id,
          userId: user?.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Handle toggle behavior based on API response
        if (data.action === 'added') {
          setInterestStatus('already_interested')
        } else if (data.action === 'removed') {
          setInterestStatus('none')
        } else {
          // Fallback for existing behavior
          if (data.alreadyInterested) {
            setInterestStatus('already_interested')
          } else {
            setInterestStatus('already_interested')
          }
        }
      } else {
        throw new Error(data.error || 'Failed to express interest')
      }
    } catch (error) {
      console.error('Error expressing interest:', error)
    }
  }

  // Simple close handler
  const handleClose = () => {
    console.log('🔒 handleClose called:', { 
      applicant: localApplicant?.id, 
      isOpen
    })
    onClose()
  }





  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="sm:max-w-[1100px] w-[95vw] max-h-[95vh] overflow-hidden p-0 rounded-xl" 
          style={{ 
          backgroundColor: theme === 'dark' ? '#111111' : '#f8f9fa' 
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex h-[95vh]">
            {/* Main Panel - Applicant Details */}
            <div className="flex-1 flex flex-col">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between px-6 py-5 bg-sidebar h-16 border-b border-[#cecece99] dark:border-border">
                <div className="flex items-center gap-3">
                  <Badge className="text-xs h-6 flex items-center rounded-[6px]">
                    Talent Pool
                  </Badge>

                </div>
              </div>

              {/* Applicant Header */}
              <div className="px-6 py-5">
                {/* User Info - Single Column Layout */}
                <div className="mb-6">
                  {/* Avatar, Name, Position, and Interest Button */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={localApplicant.profile_picture || "/avatars/shadcn.svg"} alt="Applicant Avatar" />
                        <AvatarFallback className="text-2xl">
                          {localApplicant.first_name 
                            ? localApplicant.first_name[0].toUpperCase()
                            : String(localApplicant.user_id).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-2xl font-semibold">
                          {localApplicant.first_name || `User ${localApplicant.user_id}`}
                        </div>
                        <p className="text-base text-muted-foreground">
                          {localApplicant.job_title || 'No Position'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Interest Button */}
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-muted-foreground mb-2">Are you interested in this candidate?</p>
                      <Button 
                        className="w-fit"
                        onClick={handleExpressInterest}
                        variant={interestStatus === 'already_interested' ? 'secondary' : 'default'}
                        size="sm"
                      >
                        {interestStatus === 'already_interested' ? 'Interested ✓' :
                         'I\'m Interested'}
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Tabs Row */}
                <div className="flex-shrink-0">
                  <div className={`rounded-xl p-1 w-fit ${
                    theme === 'dark' 
                      ? 'bg-white/5 border border-white/10' 
                      : 'bg-gray-100/80 border border-gray-200'
                  }`}>
                    <AnimatedTabs
                      tabs={[
                        { title: "Summary", value: "information" },
                        { title: "AI Analysis", value: "ai-analysis" }
                      ]}
                      containerClassName="grid grid-cols-2 w-fit"
                      onTabChange={(tab) => setActiveTab(tab.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6">
                <Separator />
              </div>

              {/* Applicant Details with Tabs */}
              <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">



                  {/* Information Tab */}
                  <TabsContent value="information" className="space-y-6">
                                          {/* Bio Section */}
                      <div>
                        <div className="flex items-center justify-between min-h-[40px]">
                          <h3 className="text-lg font-medium text-muted-foreground">Bio</h3>
                        </div>
                        <div className="rounded-lg p-6 text-sm leading-relaxed border shadow-sm">
                          {localApplicant.summary || localApplicant.details || "No summary provided."}
                        </div>
                      </div>

                      {/* Additional Information Section */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between min-h-[40px]">
                          <h3 className="text-lg font-medium text-muted-foreground">Additional Information</h3>
                        </div>
                        <div className="rounded-lg border border-[#cecece99] dark:border-border overflow-hidden">

                          
                                                     {/* Expected Salary */}
                           <DataFieldRow
                             icon={<IconCash className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                             label="Expected Salary"
                             fieldName="expected_monthly_salary"
                             value={formatNumber(localApplicant.expected_monthly_salary ?? '')}
                             onSave={() => {}} // Empty function since it's read-only
                             readOnly={true}
                           />
                           
                           {/* Video Introduction */}
                           <DataFieldRow
                             icon={<IconVideo className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                             label="Video Introduction"
                             fieldName="video_introduction_url"
                             value={localApplicant.video_introduction_url || ''}
                             onSave={() => {}} // Empty function since it's read-only
                             readOnly={true}
                             isLast={true}
                           />
                        </div>
                      </div>

                      {/* Skills and BPOC Section - 2 Columns */}
                      <div className="mt-8 grid grid-cols-2 gap-6">
                        {/* Skills Section */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between min-h-[40px]">
                            <h3 className="text-lg font-medium text-muted-foreground">Skills</h3>
                          </div>
                          <div className="rounded-lg p-6 border flex-1 shadow-sm">
                            <div className="space-y-4">
                              {/* Dynamic Skills Categories */}
                              {(() => {
                                // First priority: Check if we have structured skills data with categories
                                const originalSkillsData = (localApplicant as any).originalSkillsData
                                if (originalSkillsData && typeof originalSkillsData === 'object' && !Array.isArray(originalSkillsData)) {
                                  // Check if we have a skills object with categories (like your sample data)
                                  if (originalSkillsData.skills && typeof originalSkillsData.skills === 'object') {
                                    const skillsCategories = originalSkillsData.skills
                                    const validCategories = Object.keys(skillsCategories).filter(cat => 
                                      Array.isArray(skillsCategories[cat]) && skillsCategories[cat].length > 0
                                  )
                                  
                                  if (validCategories.length > 0) {
                                    return validCategories.map((category) => (
                                      <div key={category}>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                   {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsCategories[category].map((skill: string, index: number) => (
                                            <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ))
                                  }
                                }
                                
                                  // Fallback: Look for individual skills arrays
                                  const skillsData = originalSkillsData.skills || originalSkillsData.technical_skills || originalSkillsData.soft_skills || originalSkillsData.languages
                                  
                                  if (skillsData && Array.isArray(skillsData) && skillsData.length > 0) {
                                    return (
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {skillsData.map((skill: string, index: number) => (
                                            <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  }
                                  
                                  // If no skills array found, try to find any array data that might be skills
                                  const arrayKeys = Object.keys(originalSkillsData).filter(key => 
                                    Array.isArray(originalSkillsData[key]) && 
                                    originalSkillsData[key].length > 0 &&
                                    typeof originalSkillsData[key][0] === 'string'
                                  )
                                  
                                  if (arrayKeys.length > 0) {
                                    return arrayKeys.map((key) => (
                                      <div key={key}>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {originalSkillsData[key].map((skill: string, index: number) => (
                                            <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ))
                                  }
                                }
                                
                                // Second priority: Use the extracted skills array if no structured data found
                                if (Array.isArray(localApplicant.skills) && localApplicant.skills.length > 0) {
                                  return (
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">All Skills</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {localApplicant.skills.map((skill: string, index: number) => (
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
                                  <span className="text-sm text-muted-foreground">No skills data available</span>
                                )
                              })()}
                            </div>
                          </div>
                        </div>

                                                {/* Resume Score Container */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between min-h-[40px]">
                            <h3 className="text-lg font-medium text-muted-foreground">Resume Score</h3>
                          </div>
                          <div className="rounded-lg p-6 border flex-1 shadow-sm flex flex-col items-center justify-center text-center">
                            {/* Overall Resume Score with View Resume Button */}
                            {localApplicant.aiAnalysis?.overall_score ? (
                              <div className="space-y-4">
                                <div className="text-3xl font-bold text-foreground">
                                  {localApplicant.aiAnalysis.overall_score}/100
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  AI-Powered Resume Quality Assessment
                                </p>
                                
                                {/* View Resume Button */}
                                {localApplicant.resume_slug && (
                                  <div className="mt-4">
                                    <Button 
                                      onClick={() => window.open(`https://www.bpoc.io/${localApplicant.resume_slug}`, '_blank')}
                                      variant="default"
                                      className="w-fit"
                                      size="sm"
                                    >
                                      View Resume
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                <p className="text-sm">No resume score available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Work Experience, Education, and Projects Section */}
                      <div className="mt-8 space-y-6">
                                                {/* Work Experience Section */}
                        {(() => {
                          const originalSkillsData = (localApplicant as any).originalSkillsData
                          if (originalSkillsData?.experience && Array.isArray(originalSkillsData.experience) && originalSkillsData.experience.length > 0) {
                            return (
                              <div>
                                <div className="flex items-center justify-between min-h-[40px]">
                            <h3 className="text-lg font-medium text-muted-foreground">Work Experience</h3>
                          </div>
                                <div className="rounded-lg p-6 border flex-1 shadow-sm">
                                  <div>
                                    {originalSkillsData.experience.map((exp: any, index: number) => (
                                      <div key={index}>
                                        <div className="space-y-2">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <h4 className="font-medium text-foreground">{exp.title}</h4>
                                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                              {exp.duration}
                                            </Badge>
                                          </div>
                                          {exp.achievements && Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                                            <div className="mt-3">
                                              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                                <IconAward className="h-4 w-4" />
                                                Key Achievements:
                                              </p>
                                              <ul className="space-y-1">
                                                {exp.achievements.map((achievement: string, achievementIndex: number) => (
                                                  <li key={achievementIndex} className="text-sm text-foreground flex items-center gap-2">
                                                    <span className="text-primary flex-shrink-0">•</span>
                                                    <span>{achievement}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                        {index < originalSkillsData.experience.length - 1 && (
                                          <div className="mt-4 pt-4 border-t border-border/50" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        })()}

                        {/* Education Section */}
                        {(() => {
                          const originalSkillsData = (localApplicant as any).originalSkillsData
                          if (originalSkillsData?.education && Array.isArray(originalSkillsData.education) && originalSkillsData.education.length > 0) {
                            return (
                              <div>
                                <div className="flex items-center justify-between min-h-[40px]">
                            <h3 className="text-lg font-medium text-muted-foreground">Education</h3>
                          </div>
                                <div className="rounded-lg p-6 border flex-1 shadow-sm">
                                  <div>
                                    {originalSkillsData.education.map((edu: any, index: number) => {
                                      // Debug: Log education data structure
                                      console.log(`🔍 Education ${index} data:`, edu)
                                      return (
                                      <div key={index}>
                                        <div className="space-y-2">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <h4 className="font-medium text-foreground">{edu.degree}</h4>
                                              {edu.major && String(edu.major).trim() && (
                                                <p className="text-sm text-muted-foreground font-medium">{edu.major}</p>
                                              )}
                                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                              {edu.location && String(edu.location).trim() && (
                                                <p className="text-xs text-muted-foreground">{edu.location}</p>
                                              )}
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                              {edu.year || edu.years}
                                            </Badge>
                                          </div>
                                          {edu.highlights && Array.isArray(edu.highlights) && edu.highlights.length > 0 && (
                                            <div className="mt-3">
                                              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                                <IconSparkles className="h-4 w-4" />
                                                Highlights:
                                              </p>
                                              <ul className="space-y-1">
                                                {edu.highlights.map((highlight: string, highlightIndex: number) => (
                                                  <li key={highlightIndex} className="text-sm text-foreground flex items-center gap-2">
                                                    <span className="text-primary flex-shrink-0">•</span>
                                                    <span>{highlight}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                        {index < originalSkillsData.education.length - 1 && (
                                          <div className="mt-4 pt-4 border-t border-border/50" />
                                        )}
                                      </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        })()}

                        {/* Projects Section */}
                        {(() => {
                          const originalSkillsData = (localApplicant as any).originalSkillsData
                          if (originalSkillsData?.projects && Array.isArray(originalSkillsData.projects) && originalSkillsData.projects.length > 0) {
                            return (
                              <div>
                                <div className="flex items-center justify-between min-h-[40px]">
                            <h3 className="text-lg font-medium text-muted-foreground">Projects</h3>
                          </div>
                                <div className="rounded-lg p-6 border flex-1 shadow-sm">
                                  <div>
                                    {originalSkillsData.projects.map((project: any, index: number) => {
                                      // Debug: Log project data structure
                                      console.log(`🔍 Project ${index} data:`, project)
                                      return (
                                      <div key={index}>
                                        <div className="space-y-2">
                                          <div className="mb-2">
                                            <h4 className="font-medium text-foreground">{project.title}</h4>
                                            {project.description && String(project.description).trim() && (
                                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                            )}
                                            {project.duration && String(project.duration).trim() && (
                                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <IconClock className="h-3 w-3" />
                                                {project.duration}
                                              </p>
                                            )}
                                          </div>
                                          {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                                            <div className="mt-3">
                                              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                                <IconCode className="h-4 w-4" />
                                                Technologies:
                                              </p>
                                              <div className="flex flex-wrap gap-2">
                                                {project.technologies.map((tech: string, techIndex: number) => (
                                                  <Badge key={techIndex} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                                    {tech}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          {(() => {
                                            // Check if impact has meaningful content
                                            if (!project.impact) return null;
                                            
                                            let hasContent = false;
                                            if (Array.isArray(project.impact)) {
                                              hasContent = project.impact.length > 0 && project.impact.some((item: any) => String(item).trim());
                                            } else {
                                              hasContent = String(project.impact).trim().length > 0;
                                            }
                                            
                                            if (!hasContent) return null;
                                            
                                            return (
                                              <div className="mt-3">
                                                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                                  <IconAward className="h-4 w-4" />
                                                  Impact:
                                                </p>
                                                {Array.isArray(project.impact) ? (
                                                  <ul className="space-y-1">
                                                    {project.impact
                                                      .filter((item: any) => String(item).trim()) // Filter out empty items
                                                      .map((impactItem: string, impactIndex: number) => (
                                                        <li key={impactIndex} className="text-sm text-foreground flex items-center gap-2">
                                                          <span className="text-primary flex-shrink-0">•</span>
                                                          <span>{impactItem}</span>
                                                        </li>
                                                      ))}
                                                  </ul>
                                                ) : (
                                                  <ul className="space-y-1">
                                                    <li className="text-sm text-foreground flex items-center gap-2">
                                                      <span className="text-primary flex-shrink-0">•</span>
                                                      <span>{project.impact}</span>
                                                    </li>
                                                  </ul>
                                                )}
                                              </div>
                                            );
                                          })()}
                                          {project.url && String(project.url).trim() && (
                                            <div className="mt-3">
                                              <a 
                                                href={project.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                                              >
                                                <IconExternalLink className="h-3 w-3" />
                                                View Project
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                        {index < originalSkillsData.projects.length - 1 && (
                                          <div className="mt-4 pt-4 border-t border-border/50" />
                                        )}
                                      </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        })()}
                      </div>

                  {/* Additional Details Section */}
                  {localApplicant.details && (
                    <div>
                                              <div className="flex items-center justify-between min-h-[40px]">
                          <h3 className="text-lg font-medium text-muted-foreground">Additional Details</h3>
                        </div>
                      <div className="rounded-lg p-6 text-sm leading-relaxed border border-[#cecece99] dark:border-border">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {localApplicant.details}
                        </p>
                      </div>
                    </div>
                  )}
                  </TabsContent>

                  {/* AI Analysis Tab */}
                  <TabsContent value="ai-analysis" className="space-y-6 overflow-y-auto flex-1 min-h-0">
                    {(() => {
                      // Debug: Check what data we have
                      console.log('🔍 AI Analysis Debug:', { 
                        applicantId: localApplicant?.id, 
                        hasAiAnalysis: !!localApplicant?.aiAnalysis, 
                        aiAnalysisData: localApplicant?.aiAnalysis 
                      })
                      return null
                    })()}
                    
                    {!localApplicant?.aiAnalysis ? (
                      // No analysis state
                      <div className="flex flex-col h-full">
                        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20 flex-1 flex items-center justify-center">
                          <div>
                            <p className="text-sm font-medium">No AI Analysis</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Analysis results display
                      <div className="space-y-6">
                                                

                        {/* All Analysis Cards in Single Grid */}
                        {(() => {
                          const strengths = localApplicant.aiAnalysis?.strengths_analysis
                          if (!strengths) return null
                          
                          const categories = [
                            { key: 'topStrengths', label: 'Top Strengths', icon: '⭐' },
                            { key: 'coreStrengths', label: 'Core Strengths', icon: '💪' },
                            { key: 'technicalStrengths', label: 'Technical Strengths', icon: '⚙️' },
                            { key: 'achievements', label: 'Notable Achievements', icon: '🏆' },
                            { key: 'marketAdvantage', label: 'Market Advantages', icon: '📈' },
                            { key: 'uniqueValue', label: 'Unique Value Proposition', icon: '💎' },
                            { key: 'areasToHighlight', label: 'Areas to Highlight', icon: '✨' }
                          ]
                          
                          // Get data for special cards
                          const topStrengthsData = strengths.topStrengths
                          const keyStrengthsData = localApplicant.aiAnalysis?.key_strengths
                          const aiEnhancedSummary = localApplicant.aiAnalysis?.improved_summary
                          
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                              {/* AI-Enhanced Summary Card - First, spans full width */}
                                {aiEnhancedSummary && (
                                  <Card className="h-full col-span-2 border bg-transparent">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                                        <span>✍️</span>
                                        AI-Enhanced Summary
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-foreground/90">
                                      <p className="leading-relaxed">{aiEnhancedSummary}</p>
                                    </CardContent>
                                  </Card>
                                )}
                                
                                {/* Top Strengths Card */}
                                {topStrengthsData && (
                                  <Card className="h-full border bg-transparent">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                                        <span>⭐</span>
                                        Top Strengths
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-foreground/90">
                                      {Array.isArray(topStrengthsData) ? (
                                        <ol className="list-decimal ml-4 space-y-1">
                                          {topStrengthsData.map((item: any, idx: number) => (
                                            <li key={idx}>
                                              {typeof item === 'string' ? item : (item as any)?.title || (item as any)?.name || (item as any)?.description || 'Item'}
                                            </li>
                                          ))}
                                        </ol>
                                      ) : typeof topStrengthsData === 'string' ? (
                                        <ol className="list-decimal ml-4 space-y-1">
                                          <li>{topStrengthsData}</li>
                                        </ol>
                                      ) : (
                                        <ol className="list-decimal ml-4 space-y-1">
                                          <li>{JSON.stringify(topStrengthsData)}</li>
                                        </ol>
                                      )}
                                    </CardContent>
                                  </Card>
                                )}
                                
                                {/* Key Strengths Card */}
                                {Array.isArray(keyStrengthsData) && keyStrengthsData.length > 0 && (
                                  <Card className="h-full border bg-transparent">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                                        <span>🎯</span>
                                        Key Strengths
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-foreground/90">
                                      <ol className="list-decimal ml-4 space-y-1">
                                        {keyStrengthsData.map((strength: any, idx: number) => (
                                          <li key={idx}>
                                            {typeof strength === 'string' ? strength : (strength as any)?.title || (strength as any)?.name || 'Strength'}
                                          </li>
                                        ))}
                                      </ol>
                                    </CardContent>
                                  </Card>
                                )}
                                
                                {/* Other categories */}
                                {categories.filter(({ key }) => key !== 'topStrengths').map(({ key, label, icon }) => {
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
                                    <Card key={key} className="h-full border bg-transparent">
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
                                                {typeof item === 'string' ? item : (item as any)?.title || (item as any)?.name || (item as any)?.description || 'Item'}
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
                                }).filter(Boolean)}
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
